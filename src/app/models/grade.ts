import { Testsession } from './testsession';

export class Grade {
  id: number;
  gradeName: string;
  gradeValue: number;
  testsessionId: number;

  constructor(
    id: number,
    gradeName: string,
    gradeValue: number,
    testsessionId: number,
  ) {
    this.id = id;
    this.gradeName = gradeName;
    this.gradeValue = gradeValue;
    this.testsessionId = testsessionId;
  }
}
