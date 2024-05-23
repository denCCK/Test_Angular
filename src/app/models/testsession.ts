import { Test } from './test';
import { Grade } from './grade';

export class Testsession {
  id: number;
  testsessionName: string;
  testsessionDescription: string;
  startDate: Date;
  endDate: Date;
  testId: number;
  creationDate: Date;
  lastChangeDate: Date;
  grade: Grade[];

  constructor(
    id: number,
    testsessionName: string,
    testsessionDescription: string,
    startDate: Date,
    endDate: Date,
    testId: number,
    creationDate: Date,
    lastChangeDate: Date,
    grades: Grade[]
  ) {
    this.id = id;
    this.testsessionName = testsessionName;
    this.testsessionDescription = testsessionDescription;
    this.startDate = startDate;
    this.endDate = endDate;
    this.testId = testId;
    this.creationDate = creationDate;
    this.lastChangeDate = lastChangeDate;
    this.grade = grades;
  }
}

