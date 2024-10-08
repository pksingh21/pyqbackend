import { Request, Response, NextFunction } from 'express';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

import { auth } from '../firebase';

dotenv.config();

const prisma = new PrismaClient();

// verify jwt along with auth level
const protectAuthLevel = (authLevelProvided: string) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies['auth_token'];
    if (!token) return next(new AppError('A token is required for authentication', 403));

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as User;
      const { uid } = decoded;

      const user: User | null = await prisma.user.findUnique({
        where: { uid: String(uid) },
      });

      if (!user) throw new Error('Invalid token');

      req.user = user;

      // Authorization logic here
      if (authLevelProvided === 'admin' && req.user.isAdmin !== true) {
        return next(new AppError('Access denied', 403));
      }

      next();
    } catch (err) {
      console.log({ err });
      return next(new AppError('Invalid token', 401));
    }
  });
};

const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['auth_token'];
  console.log({ token });

  if (!token) return next(new AppError('A token is required for authentication', 403));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as User;

    const { uid } = decoded;

    console.log({ decoded });
    const user: User | null = await prisma.user.findUnique({
      where: { uid: String(uid) },
    });

    console.log({ user });

    if (!user) throw Error('Invalid token');

    req.user = user;
  } catch (err) {
    return next(new AppError('Invalid token', 401));
  }

  return next();
});

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { token: idToken } = req.body;

  const decodedToken = await auth.verifyIdToken(idToken);

  const { uid, phone_number } = decodedToken;

  const user: User | null = await prisma.user.findUnique({
    where: { uid: String(uid) },
  });

  console.log({ user });

  const token: String = jwt.sign({ uid }, process.env.JWT_SECRET_KEY as string, {
    expiresIn: `${process.env.JWT_EXPIRES_IN_DAYS}d`,
  });

  let statusCode: number | null = null;
  let message: String | null = null;
  let userData: User | null = null;

  if (!user) {
    // create the user if user doesn't exist
    const newUser = await prisma.user.create({
      data: {
        uid: String(uid),
        phoneNumber: String(phone_number),
      },
    });

    statusCode = 201;
    message = 'User Created successfully ';
    userData = newUser;
  } else {
    statusCode = 200;
    message = 'User found!!';
    userData = user;
  }

  res.cookie('auth_token', token, {
    httpOnly: true,
    maxAge: Number(process.env.JWT_EXPIRES_IN_DAYS) * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(statusCode).json({ message, user: userData });
});

const getLoginStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).send({ message: 'Already logged in!', user: req.user });
});

const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  res.cookie('auth_token', 'loggedout', {
    httpOnly: true,
    expires: new Date(0),
    secure: process.env.NODE_ENV === 'production',
  });

  res.status(200).send({ message: 'Logged out successfully' });
});

export { login, getLoginStatus, logout, protect, protectAuthLevel };
