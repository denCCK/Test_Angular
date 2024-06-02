// open.component.ts
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {AnswerService} from "../service/AnswerService";
import {Answer} from "../models/answer";
import {MathJaxService} from "../service/MathJaxService";

@Component({
  selector: 'app-open',
  template: `
    <div [formGroup]="form">
        <input formControlName="isFormula" type="checkbox" /> Формула
        <div *ngIf="form.get('isFormula')?.value; else textInput">
            <tui-input formControlName="text" placeholder="Введите формулу" (input)="renderMath()" />
            <h3 [innerHTML]="form.get('text')?.value | mathjax"></h3>
        </div>
        <ng-template #textInput>
            <tui-textarea formControlName="text" placeholder="Введите вариант ответа" />
        </ng-template>
    </div>
  `,
})
export class OpenComponent implements OnInit, OnChanges {
  @Input() questionId: number | null = null;
  @Input() answers: Answer[] = [];
  @Output() formChange = new EventEmitter<FormGroup>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private mathJaxService: MathJaxService) {
    this.form = this.fb.group({
      text: '',
      isFormula: false,
      formula: '',
    });
    this.form.valueChanges.subscribe(() => this.formChange.emit(this.form));
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
      const answer = this.answers[0];
      this.form = this.fb.group({
        isFormula: answer.isFormula,
        text: answer.answerText,
      });
    }
  }

  renderMath() {
    this.mathJaxService.renderMathJax();
  }

}
