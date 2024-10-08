// schema.ts
import Joi from 'joi';

// Schema for creating a paper
export const CreatePaperDTO = Joi.object({
  title: Joi.string().required(),
  isModule: Joi.boolean().default(false),
  questionCount: Joi.number().min(1).required(),
  // duration: Joi.number().integer().min().required(),
});

// Schema for getting a single paper by ID (route param)
export const GetPaperParamsDTO = Joi.object({
  id: Joi.string().required(),
});

// Schema for updating a paper by ID (route param)
export const UpdatePaperParamsDTO = Joi.object({
  id: Joi.string().required(),
});

// Schema for updating a paper (body)
export const UpdatePaperDTO = Joi.object({
  title: Joi.string().optional(),
  isModule: Joi.boolean().optional(),
  duration: Joi.number().integer().min(1).optional(),
});

// Schema for updating tags for a paper
export const UpdateTagsForPaperDTO = Joi.object({
  tagIds: Joi.array().items(Joi.string()).optional(),
});

// Schema for deleting a paper by ID (route param)
export const DeletePaperParamsDTO = Joi.object({
  id: Joi.string().required(),
});
