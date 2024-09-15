export interface CreateQuestionDTO {
  text: string;
  id: string;
  isMultiCorrect: boolean;
  choices: { id: string; isAnswer: boolean; text: string }[];
}

export interface CreateQuestionsDTO extends Array<CreateQuestionDTO> {}
