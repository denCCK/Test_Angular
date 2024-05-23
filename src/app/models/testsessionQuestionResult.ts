import { Question } from './question';

export class TestsessionQuestionResult {
  id: number;
  question: Question;
  isCorrect: boolean;
  point: number;

  constructor(
    id: number,
    question: Question,
    isCorrect: boolean,
    point: number
  ) {
    this.id = id;
    this.question = question;
    this.isCorrect = isCorrect;
    this.point = point;
  }
}
