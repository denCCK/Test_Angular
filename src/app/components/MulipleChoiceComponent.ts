// multiple-choice.component.ts
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {Answer} from "../models/answer";

@Component({
  selector: 'app-multiple-choice',
  template: `
    <div [formGroup]="form">
      <div formArrayName="choices" *ngFor="let choice of choices.controls; let i = index">
        <div [formGroupName]="i">
          <input formControlName="text" type="text" placeholder="Введите вариант ответа" />
          <input formControlName="isCorrect" type="checkbox" /> Правильный
          <input formControlName="image" type="file" />
          <button type="button" (click)="removeChoice(i)">Удалить</button>
        </div>
      </div>
      <button type="button" (click)="addChoice()">Добавить вариант</button>
    </div>
  `,
})
export class MultipleChoiceComponent implements OnInit, OnChanges {
  @Input() data: any;
  @Input() answers: Answer[] = [];
  @Output() formChange = new EventEmitter<FormGroup>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      choices: this.fb.array([]),
    });
    this.addChoice();
    this.form.valueChanges.subscribe(() => this.formChange.emit(this.form));
  }

  get choices() {
    return this.form.get('choices') as FormArray;
  }

  addChoice() {
    this.choices.push(this.fb.group({
      text: '',
      isCorrect: false,
      image: null,
    }));
  }

  removeChoice(index: number) {
    this.choices.removeAt(index);
  }


  ngOnInit(): void {
    console.log(this.answers);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['answers'] && this.answers) {
      this.loadAnswers();
    }
  }


  private loadAnswers() {
    if (this.answers != undefined) {
      this.choices.clear();
      this.answers.forEach(answer => {
        this.choices.push(this.fb.group({
          text: answer.answerText,
          isCorrect: answer.isCorrect,
          image: answer.answerImg,
        }));
      })
    }
  }
}
