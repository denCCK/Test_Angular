// multiple-choice.component.ts
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {Answer} from "../models/answer";
import {MathJaxService} from "../service/MathJaxService";

@Component({
  selector: 'app-multiple-choice',
  template: `
    <div [formGroup]="form">
      <div formArrayName="choices" *ngFor="let choice of choices.controls; let i = index">
        <div [formGroupName]="i">
            <input formControlName="isFormula" type="checkbox" (change)="toggleFormula(choice)" /> Формула
            <div *ngIf="choice.get('isFormula')?.value; else textInput">
                <tui-input formControlName="text" placeholder="Введите формулу" (input)="renderMath()" />
                <h3 [innerHTML]="choice.get('text')?.value | mathjax"></h3>
            </div>
            <ng-template #textInput>
                <tui-input formControlName="text" placeholder="Введите вариант ответа" />
            </ng-template>
            <input formControlName="isCorrect" type="checkbox" />Правильный
            <input formControlName="image" type="file" />
            <button type="button" (click)="removeChoice(i)">Удалить</button>
        </div>
      </div>
      <button type="button" (click)="addChoice()">Добавить вариант</button>
    </div>
  `,
})
export class MultipleChoiceComponent implements OnInit, OnChanges {
  @Input() questionId: number | null = null;
  @Input() answers: Answer[] = [];
  @Output() formChange = new EventEmitter<FormGroup>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private mathJaxService: MathJaxService) {
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
      isFormula: false,
    }));
  }

  removeChoice(index: number) {
    this.choices.removeAt(index);
  }

  toggleFormula(choice: any) {
    if (!choice.get('isFormula').value) {
      choice.patchValue({ formula: '' });
    }
  }

  renderMath() {
    this.mathJaxService.renderMathJax();
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
          isFormula: answer.isFormula
        }));
      })
    }
  }
}
