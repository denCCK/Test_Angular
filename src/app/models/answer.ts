import {Question} from "./question";

export class Answer {
  id: number;
  answerText: string;
  answerImg: string;
  isCorrect: boolean;
  isFormula: boolean;
  complianceText: string;
  complianceImg: string;
  isComplianceFormula: boolean;
  answerFormula: string;
  question: Question;

  constructor(id: number,
              answerText: string,
              answerImg: string,
              isCorrect: boolean,
              isFormula: boolean,
              complianceText: string,
              complianceImg: string,
              isComplianceFormula: boolean,
              answerFormula: string,
              question: Question) {
    this.id = id;
    this.answerText = answerText;
    this.answerImg = answerImg;
    this.isCorrect = isCorrect;
    this.isFormula = isFormula;
    this.complianceText = complianceText;
    this.complianceImg = complianceImg;
    this.isComplianceFormula = isComplianceFormula;
    this.answerFormula = answerFormula;
    this.question = question;
  }


}
