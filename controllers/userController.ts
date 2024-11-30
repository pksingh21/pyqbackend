import { Request, Response, NextFunction } from 'express';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { auth } from '../firebase';

const prisma = new PrismaClient();

// Create a new user
const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { phoneNumber, firstName, lastName, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser: User = await prisma.user.create({
    data: {
      phoneNumber,
      firstName,
      lastName,
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
    where: { id },
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

// Update profile of user
const updateProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.user as User;
  const { user: userData } = req.body;

  const updatableFields: (keyof User)[] = ['firstName', 'lastName', 'email'];

  const fieldsToBeUpdated = updatableFields.filter((field) => {
    const a = req.user![field];
    const b = userData[field];
    if (a !== b) {
      if ((a == null || a === '') && (b == null || b == '')) return false;
      return true;
    }
    return false;
  });

  const data: Partial<User> = {};
  fieldsToBeUpdated.forEach((field) => (data[field] = userData[field]));

  const updatedUser: User = await prisma.user.update({
    where: { id },
    data,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

// Update a user by ID
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { phoneNumber, firstName, lastName, email, password } = req.body;

  const updatedData: Partial<User> = { phoneNumber, firstName, lastName, email };

  if (password) {
    updatedData.password = await bcrypt.hash(password, 12);
  }

  const updatedUser: User = await prisma.user.update({
    where: { id },
    data: updatedData,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

const verifyEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { email }: { email: string } = req.body as { email: string };

  if (!email) {
    return next(new AppError(`User doesn't have an email id yet`, 404));
  }

  const currentUsers = await prisma.user.findMany({
    where: { email: email },
  });

  if (currentUsers.length > 0) {
    if (currentUsers.length === 1) {
      if (currentUsers[0].isEmailVerified && currentUsers[0].password?.length != 0)
        res.status(200).json({
          status: 'success',
          isEmailVerified: true,
        });
    } else {
      return next(new AppError(`this email is already present with multiple users , please check database`, 404));
    }
  }

  res.status(200).json({
    status: 'success',
    isEmailVerified: false,
  });
});

const confirmUserEmail = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id }: { id: string } = req.body as { id: string };
  console.log(id);
  const updatedUser = await prisma.user.update({
    where: { id: id }, // Exclude the current user's ID
    data: {
      isEmailVerified: true,
    },
  });

  res.status(200).json({
    status: 'success',
    data: {
      updatedUser: updatedUser,
    },
  });
});

const updateTagsForUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params; // id of the user
  const { tagIds }: { tagIds?: string[] } = req.body;

  // Fetch the existing User to ensure they exist
  const existingUser = await prisma.user.findUnique({
    where: { id },
  });

  if (!existingUser) {
    return next(new AppError('User not found', 404));
  }

  // Perform the update
  const updatedUser = await prisma.user.update({
    where: { id },
    data: {
      interested: {
        set: tagIds ? tagIds.map((tagId) => ({ id: tagId })) : [], // 'set' will replace existing tags with new ones
      },
    },
  });

  res.status(200).json({ message: 'User tags updated', user: updatedUser });
});

// Delete a user by ID
const deleteUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await prisma.user.delete({
    where: { id },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

export default { createUser, getUser, updateUser, deleteUser, updateProfile, verifyEmail, confirmUserEmail };
