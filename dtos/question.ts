import { ChoiceDTO } from '.';

export interface QuestionDTO {
  text: string;
  id: string;
  isMultiCorrect: boolean;
  choices: ChoiceDTO[];
}
