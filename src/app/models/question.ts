import {User} from "./user";

export class Question {
  id: number;
  questionName: string;
  questionDescription: string;
  creationDate: Date;
  lastChangeDate: Date;
  questionPoint: number;
  questionType: string;
  answersType: string;
  difficulty: number;
  user: User;

  constructor(
    question_id: number,
    question_name: string,
    question_description: string,
    creation_date: Date,
    last_change_date: Date,
    question_point: number,
    questionType: string,
    answers_type: string,
    difficulty: number,
    user: User,
  ) {
    this.id = question_id;
    this.questionName = question_name;
    this.questionDescription = question_description;
    this.creationDate = creation_date;
    this.lastChangeDate = last_change_date;
    this.questionPoint = question_point;
    this.questionType = questionType;
    this.answersType = answers_type;
    this.difficulty = difficulty;
    this.user = user;
  }
}

