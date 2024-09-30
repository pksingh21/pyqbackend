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

const ChoiceDTOStripId = ChoiceDTO.fork(['id'], (schema) => schema.strip());

const QuestionDTOStripId = QuestionDTO.fork(['id'], (schema) => schema.strip()).keys({
  choices: Joi.array().items(ChoiceDTOStripId).min(2).required(),
});

// stripping 'id' from QuestionDTO and ChoiceDTO
export const CreateQuestionsDTO = Joi.object({
  questions: Joi.array().items(QuestionDTOStripId).min(1).required(),
});

// Schema for getting a single question by ID (route param)
export const GetQuestionParamsDTO = Joi.object({
  id: Joi.string().required(),
});

// Schema for getting a single question with optional choices (query param)
export const GetQuestionQueryDTO = Joi.object({
  includeChoices: Joi.string().valid('true', 'false').optional().default('false'),
});

// Schema for getting multiple questions with pagination (query param)
export const GetQuestionsQueryDTO = Joi.object({
  page: Joi.number().integer().min(1).required(),
  limit: Joi.number().integer().min(1).required(),
  includeChoices: Joi.boolean().optional(),
});

// Schema for updating a question (body)
export const UpdateQuestionDTO = Joi.object({
  question: QuestionDTO.required(),
});

// Schema for updating a question by ID (route param)
export const UpdateQuestionParamsDTO = Joi.object({
  id: Joi.string().required(),
});

// Schema for updating question choices (body)
export const UpdateQuestionChoiceBodyDTO = Joi.object({
  choices: Joi.array().items(Joi.string().min(1)).min(2).required(),
});

// Schema for deleting a question by ID (route param)
export const DeleteQuestionParamsDTO = Joi.object({
  id: Joi.string().required(),
});

// Schema for deleting a question with choices by ID (route param)
export const DeleteQuestionWithChoicesParamsDTO = Joi.object({
  id: Joi.string().required(),
});
