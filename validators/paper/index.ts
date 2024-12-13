// paperValidator.ts
import * as requestDTO from './schema';

const paperValidator = {
  // Create a single paper
  createPaper: {
    body: requestDTO.CreatePaperDTO,
  },
  // Get a single paper by ID (route param)
  getPaper: {
    params: requestDTO.GetPaperParamsDTO,
  },
  // Get paper by page and limit (query param)
  getPapers: {
    query: requestDTO.GetPapersQueryDTO,
  },
  // Update a paper by ID (route param) with optional fields in the body
  updatePaper: {
    params: requestDTO.UpdatePaperParamsDTO,
    body: requestDTO.UpdatePaperDTO,
  },
  updatePaperQuestion: {
    params: requestDTO.UpdatePaperQuestionParamsDTO,
    body: requestDTO.UpdatePaperQuestionDTO,
  },
  // Update tags for a paper by ID (route param)
  updateTagsForPaper: {
    params: requestDTO.UpdatePaperParamsDTO,
    body: requestDTO.UpdateTagsForPaperDTO,
  },
  // Delete a paper by ID (route param)
  deletePaper: {
    params: requestDTO.DeletePaperParamsDTO,
  },
};

export default paperValidator;
