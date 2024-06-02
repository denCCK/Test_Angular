import { Answer } from './answer';

export class TestsessionAnswerResult {
  id: number;
  testsessionResultId: number;
  answerId: number;
  questionId: number;
  answerText: string;
  answerImg: string;
  isCorrect: boolean;
  isFormula: boolean;
  complianceText: string;
  complianceImg: string;
  isComplianceFormula: boolean;
  answerFormula: string;


  constructor(
    id: number,
    testsessionResultId: number,
    answerId: number,
    questionId: number,
    answerText: string,
    answerImg: string,
    isCorrect: boolean,
    isFormula: boolean,
    complianceText: string,
    complianceImg: string,
    answerFormula: string,
    isComplianceFormula: boolean,
  ) {
    this.id = id;
    this.testsessionResultId = testsessionResultId;
    this.questionId = questionId;
    this.answerId = answerId;
    this.answerText = answerText;
    this.answerImg = answerImg;
    this.isCorrect = isCorrect;
    this.isFormula = isFormula;
    this.complianceText = complianceText;
    this.complianceImg = complianceImg;
    this.answerFormula = answerFormula;
    this.isComplianceFormula = isComplianceFormula;
  }
}
