import * as requestDTO from './schema';

const questionValidator = {
  // Create a single question
  createQuestion: {
    body: requestDTO.QuestionDTO,
  },
  // Create multiple questions
  createQuestions: {
    body: requestDTO.CreateQuestionsDTO,
  },
  // Get a single question by ID (route param) with optional inclusion of choices (query param)
  getQuestion: {
    params: requestDTO.GetQuestionParamsDTO,
    query: requestDTO.GetQuestionQueryDTO,
  },
  // Get multiple questions with pagination and optional inclusion of choices
  getQuestions: {
    query: requestDTO.GetQuestionsQueryDTO,
  },
  // Update a question by ID (route param) and update the question (body)
  updateQuestion: {
    params: requestDTO.UpdateQuestionParamsDTO,
    body: requestDTO.UpdateQuestionDTO,
  },
  // Update question choices by question ID (route param) and update choices (body)
  updateQuestionChoices: {
    params: requestDTO.UpdateQuestionParamsDTO,
    body: requestDTO.UpdateQuestionChoiceBodyDTO,
  },
  // Delete a question by ID (route param)
  deleteQuestion: {
    params: requestDTO.DeleteQuestionParamsDTO,
  },
  // Delete a question along with its choices by ID (route param)
  deleteQuestionWithChoices: {
    params: requestDTO.DeleteQuestionWithChoicesParamsDTO,
  },
};

export default questionValidator;
