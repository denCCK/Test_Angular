import {User} from "./user";
import {Question} from "./question";

export class Test {
  id: number;
  testName: string;
  testDescription: string;
  creationDate: Date;
  lastChangeDate: Date;
  user: User;
  questions: Question[];

  constructor(
    test_id: number,
    test_name: string,
    test_description: string,
    creation_date: Date,
    last_change_date: Date,
    user: User,
    questions: Question[]
  ) {
    this.id = test_id;
    this.testName = test_name;
    this.testDescription = test_description;
    this.creationDate = creation_date;
    this.lastChangeDate = last_change_date;
    this.user = user;
    this.questions = questions;
  }
}
