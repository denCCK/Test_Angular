import { Answer } from './answer';

export class TestsessionAnswerResult {
  id: number;
  answer: Answer;
  answerText: string;

  constructor(
    id: number,
    answer: Answer,
    answerText: string
  ) {
    this.id = id;
    this.answer = answer;
    this.answerText = answerText;
  }
}
