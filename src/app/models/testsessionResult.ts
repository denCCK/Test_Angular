

export class TestsessionResult {
  id: number;
  testsessionId: number;
  testsessionResultName: string;
  testsessionResultSurname: string;
  point: number;
  startDate: Date;
  endDate: Date;

  constructor(
    id: number,
    testsessionId: number,
    testsessionResultName: string,
    testsessionResultSurname: string,
    point: number,
    startDate: Date,
    endDate: Date,
  ) {
    this.id = id;
    this.testsessionId = testsessionId;
    this.testsessionResultName = testsessionResultName;
    this.testsessionResultSurname = testsessionResultSurname;
    this.point = point;
    this.startDate = startDate;
    this.endDate = endDate;
  }
}
