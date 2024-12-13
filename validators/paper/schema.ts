// schema.ts
import Joi from 'joi';

export const ChoiceDTO = Joi.object({
  id: Joi.string().required(),
  text: Joi.string().required(),
  isAnswer: Joi.boolean().required(),
  choiceOrder: Joi.number().min(1).required(),
  createdAt: Joi.any().strip(),
  lastUpdatedAt: Joi.any().strip(),
  createdById: Joi.any().strip(),
  questionId: Joi.any().strip(),
});

export const QuestionDTO = Joi.object({
  id: Joi.string().required(),
  text: Joi.string().required(),
  choices: Joi.array().items(ChoiceDTO).min(2).required(),
  images: Joi.array(),
  isMultiCorrect: Joi.boolean().required(),
  createdAt: Joi.any().strip(),
  lastUpdatedAt: Joi.any().strip(),
  createdById: Joi.any().strip(),
});

// Schema for creating a paper
export const CreatePaperDTO = Joi.object({
  paper: Joi.object({
    title: Joi.string().required(),
    isModule: Joi.boolean().default(false),
    questionCount: Joi.number().min(1).required(),
    // duration: Joi.number().integer().min().required(),
  }).required(),
});

// Schema for getting a single paper by ID (route param)
export const GetPaperParamsDTO = Joi.object({
  id: Joi.string().required(),
});

// Schema for getting multiple papers with pagination (query param)
export const GetPapersQueryDTO = Joi.object({
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1).required(),
  // includeChoices: Joi.boolean().optional(),
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

// Schema for updating a question in a paper by ID (route param)
export const UpdatePaperQuestionParamsDTO = Joi.object({
  id: Joi.string().required(),
  questionNumber: Joi.string().required(),
});

// Schema for updating a question in a paper by ID (body)
export const UpdatePaperQuestionDTO = Joi.object({
  question: QuestionDTO.required(),
});

// Schema for updating tags for a paper
export const UpdateTagsForPaperDTO = Joi.object({
  tagIds: Joi.array().items(Joi.string()).optional(),
});

// Schema for deleting a paper by ID (route param)
export const DeletePaperParamsDTO = Joi.object({
  id: Joi.string().required(),
});
