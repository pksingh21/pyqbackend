import { Request, Response, NextFunction } from 'express';
import { PrismaClient, Tag, TagType, User } from '@prisma/client';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import { connect } from 'http2';

const prisma = new PrismaClient();

const createTag = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, typeOfTag }: { name: string, typeOfTag: TagType } = req.body;
    const user: User = (req as any).user;
    const newTag = await prisma.tag.create({
        data: {
            name,
            type: typeOfTag,
            createdBy: {
                connect: user
            },
        },
    });

    res.status(201).json({ message: 'Tag created', tag: newTag });
});

const getTag = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const tag = await prisma.tag.findUnique({
        where: { id: Number(id) },
    });

    if (!tag) return next(new AppError('Tag not found', 404));

    res.status(200).json({ tag });
});

const updateTag = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, typeOfTag }: { name: string, typeOfTag: TagType } = req.body;

    const updatedTag = await prisma.tag.update({
        where: { id: Number(id) },
        data: { name, type: typeOfTag },
    });

    res.status(200).json({ message: 'Tag updated', tag: updatedTag });
});

const deleteTag = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    await prisma.tag.delete({
        where: { id: Number(id) },
    });

    res.status(204).send();
});

export { createTag, getTag, updateTag, deleteTag };
