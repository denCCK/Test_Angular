// match.component.ts
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {Answer} from "../models/answer";

@Component({
  selector: 'app-match',
  template: `
    <div [formGroup]="form">
      <div formArrayName="matches" *ngFor="let match of matches.controls; let i = index">
        <div [formGroupName]="i">
          <input formControlName="text" type="text" placeholder="Введите вопрос" />
          <input formControlName="image" type="file" />
          <input formControlName="matchText" type="text" placeholder="Введите ответ" />
          <input formControlName="matchImage" type="file" />
          <button type="button" (click)="removeMatch(i)">Удалить</button>
        </div>
      </div>
      <button type="button" (click)="addMatch()">Добавить соответствие</button>
    </div>
  `,
})
export class MatchComponent implements OnChanges {
  @Input() data: any;
  @Input() answers: Answer[] = [];
  @Output() formChange = new EventEmitter<FormGroup>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      matches: this.fb.array([]),
    });
    this.addMatch();
    this.form.valueChanges.subscribe(() => this.formChange.emit(this.form));
  }

  get matches() {
    return this.form.get('matches') as FormArray;
  }

  addMatch() {
    this.matches.push(this.fb.group({
      text: '',
      image: null,
      matchText: '',
      matchImage: null,
    }));
  }

  removeMatch(index: number) {
    this.matches.removeAt(index);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['answers'] && this.answers) {
      this.loadAnswers();
    }
  }


  private loadAnswers() {
    if (this.answers != undefined) {
      this.matches.clear();
      this.answers.forEach(answer => {
        this.matches.push(this.fb.group({
          text: answer.answerText,
          image: answer.answerImg,
          matchText: answer.complianceText,
          matchImage: answer.complianceImg,
        }));
      })
    }
  }
}
