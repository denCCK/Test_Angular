import { Testsession } from './testsession';

export class Grade {
  id: number;
  gradeName: string;
  gradeValue: number;

  constructor(
    id: number,
    gradeName: string,
    gradeValue: number
  ) {
    this.id = id;
    this.gradeName = gradeName;
    this.gradeValue = gradeValue;
  }
}
