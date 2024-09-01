import { Request, Response, NextFunction } from 'express';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';

const prisma = new PrismaClient();

// Create a new user
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { phoneNumber, name, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser: User = await prisma.user.create({
    data: {
      phoneNumber,
      name,
      email,
      password: hashedPassword,
    },
  });

  res.status(201).json({
    status: 'success',
    data: {
      user: newUser,
    },
  });
});

// Get a user by ID
const getUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  const user: User | null = await prisma.user.findUnique({
    where: { id: parseInt(id, 10) },
  });

  if (!user) {
    return next(new AppError('User not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

// Update a user by ID
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { phoneNumber, name, email, password } = req.body;

  const updatedData: Partial<User> = { phoneNumber, name, email };

  if (password) {
    updatedData.password = await bcrypt.hash(password, 12);
  }

  const updatedUser: User = await prisma.user.update({
    where: { id: parseInt(id, 10) },
    data: updatedData,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Delete a user by ID
const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id: parseInt(id, 10) },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export { createUser, getUser, updateUser, deleteUser };