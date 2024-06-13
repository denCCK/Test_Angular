// match.component.ts
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import {Answer} from "../models/answer";
import {MathJaxService} from "../service/MathJaxService";

@Component({
  selector: 'app-match',
  template: `
    <div [formGroup]="form">
      <div formArrayName="matches" *ngFor="let match of matches.controls; let i = index">
        <div [formGroupName]="i">
            <div>
                <label for="text" class="label">Ответ</label>
                <input type="checkbox" formControlName="isFormula" /> Ввести формулу
                <div *ngIf="match.get('isFormula')?.value; else textInput">
                    <tui-input id="formula" formControlName="text" placeholder="Введите формулу" (input)="renderMath()"></tui-input>
                    <div [innerHTML]="match.get('text')?.value | mathjax"></div>
                </div>
                <ng-template #textInput>
                    <tui-input id="text" formControlName="text" placeholder="Введите ответ"></tui-input>
                    <input formControlName="image" type="file" />
                </ng-template>
            </div>

            <div>
                <label for="matchText" class="label">Соответствие</label>
                <input type="checkbox" formControlName="isMatchFormula" /> Ввести формулу
                <div *ngIf="match.get('isMatchFormula')?.value; else matchTextInput">
                    <tui-input formControlName="matchText" placeholder="Введите формулу" (input)="renderMath()"></tui-input>
                    <div [innerHTML]="match.get('matchText')?.value | mathjax"></div>
                </div>
                <ng-template #matchTextInput>
                    <tui-input formControlName="matchText" placeholder="Введите соответствие"></tui-input>
                    <input formControlName="matchImage" type="file" />
                </ng-template>
            </div>

            <button type="button" (click)="removeMatch(i)">Удалить</button>
        </div>
      </div>
      <button type="button" (click)="addMatch()">Добавить соответствие</button>
    </div>
  `,
})
export class MatchComponent implements OnChanges {
  @Input() questionId: number | null = null;
  @Input() answers: Answer[] = [];
  @Output() formChange = new EventEmitter<FormGroup>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private mathJaxService: MathJaxService) {
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
      isFormula: false,
      text: '',
      formula: '',
      image: null,
      isMatchFormula: false,
      matchText: '',
      matchFormula: '',
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

  renderMath() {
    this.mathJaxService.renderMathJax();
  }

  private loadAnswers() {
    if (this.answers != undefined) {
      this.matches.clear();
      this.answers.forEach(answer => {
        this.matches.push(this.fb.group({
          isFormula: answer.isFormula,
          text: answer.answerText,
          image: answer.answerImg,
          isMatchFormula: answer.isComplianceFormula,
          matchText: answer.complianceText,
          matchImage: answer.complianceImg,
        }));
      })
    }
  }
}
