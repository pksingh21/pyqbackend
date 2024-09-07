import { Request, Response, NextFunction } from 'express';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

dotenv.config();

const prisma = new PrismaClient();

// verify jwt
const protect = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies['auth_token'];
  console.log({ token });

  if (!token) return next(new AppError('A token is required for authentication', 403));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { email: string };
    req.user = decoded as User;
  } catch (err) {
    return next(new AppError('Invalid token', 401));
  }

  return next();
});

const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  const user: User | null = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return next(new AppError('Invalid credentials', 401));
  }

  if (bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY as string, {
      expiresIn: '1h',
    });

    res.cookie('auth_token', token, {
      httpOnly: true,
      maxAge: 3600000,
      secure: process.env.NODE_ENV === 'production',
    });

    res.status(200).json({ message: 'Logged in successfully', user });
  } else {
    return next(new AppError('Invalid credentials', 401));
  }
});

const getLoginStatus = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  console.log({ user: req.user });

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

export { login, getLoginStatus, logout, protect };
