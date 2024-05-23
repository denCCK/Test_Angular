import { Testsession } from './testsession';
import {TestsessionAnswerResult} from "./testsessionAnswerResult";
import {TestsessionQuestionResult} from "./testsessionQuestionResult";

export class TestsessionResult {
  id: number;
  testsession: Testsession;
  testsessionResultName: string;
  testsessionResultSurname: string;
  point: number;
  startDate: Date;
  endDate: Date;
  testsessionAnswerResults: TestsessionAnswerResult[];
  testsessionQuestionResults: TestsessionQuestionResult[];

  constructor(
    id: number,
    testsession: Testsession,
    testsessionResultName: string,
    testsessionResultSurname: string,
    point: number,
    startDate: Date,
    endDate: Date,
    testsessionAnswerResults: TestsessionAnswerResult[],
    testsessionQuestionResults: TestsessionQuestionResult[]
  ) {
    this.id = id;
    this.testsession = testsession;
    this.testsessionResultName = testsessionResultName;
    this.testsessionResultSurname = testsessionResultSurname;
    this.point = point;
    this.startDate = startDate;
    this.endDate = endDate;
    this.testsessionAnswerResults = testsessionAnswerResults;
    this.testsessionQuestionResults = testsessionQuestionResults;
  }
}
