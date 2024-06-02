import { Question } from './question';

export class TestsessionQuestionResult {
  id: number;
  testsessionResultId: number;
  questionId: number;
  isCorrect: boolean;
  point: number;

  constructor(
    id: number,
    testsessionResultId: number,
    questionId: number,
    isCorrect: boolean,
    point: number
  ) {
    this.id = id;
    this.testsessionResultId = testsessionResultId;
    this.questionId = questionId;
    this.isCorrect = isCorrect;
    this.point = point;
  }
}
