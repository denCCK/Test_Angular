import {Question} from "./question";

export class Answer {
  id: number;
  answerText: string;
  answerImg: string;
  isCorrect: boolean;
  complianceText: string;
  complianceImg: string;
  question: Question;

  constructor(id: number, answerText: string, answerImg: string, isCorrect: boolean, complianceText: string, complianceImg: string, question: Question) {
    this.id = id;
    this.answerText = answerText;
    this.answerImg = answerImg;
    this.isCorrect = isCorrect;
    this.complianceText = complianceText;
    this.complianceImg = complianceImg;
    this.question = question;
  }
}
