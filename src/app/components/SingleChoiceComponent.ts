import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {Answer} from "../models/answer";
import {MathJaxService} from "../service/MathJaxService";

@Component({
  selector: 'app-single-choice',
  template: `
      <tui-loader
              class="loader"
              [inheritColor]="true"
              [overlay]="true"
              [showLoader]="loading">
          <div [formGroup]="form">
              <div formArrayName="choices" *ngFor="let choice of choices.controls; let i = index">
                  <div [formGroupName]="i">
                      <input formControlName="isFormula" type="checkbox" /> Формула
                      <div *ngIf="choice.get('isFormula')?.value; else textInput">
                          <tui-input formControlName="text" placeholder="Введите формулу" (input)="renderMath()" />
                          <h3 [innerHTML]="choice.get('text')?.value | mathjax"></h3>
                      </div>
                      <ng-template #textInput>
                          <tui-input formControlName="text" placeholder="Введите вариант ответа" />
                      </ng-template>
                      <button type="button" (click)="removeChoice(i)">Удалить</button>
                  </div>
              </div>
              <div *ngFor="let choice of choices.controls; let i = index">
                  <input formControlName="selectedChoice" type="radio" value="{{i}}" [attr.name]="'correctChoice'"/> {{i + 1}}) Правильный
              </div>
              <button type="button" (click)="addChoice()">Добавить вариант</button>
          </div>
      </tui-loader>

  `,
})
export class SingleChoiceComponent implements OnInit, OnChanges {
  @Input() questionId: number | null = null;
  @Input() answers: Answer[] = [];
  @Output() formChange = new EventEmitter<FormGroup>();

  form: FormGroup;
  loading: boolean = false;

  constructor(private fb: FormBuilder, private mathJaxService: MathJaxService) {
    this.form = this.fb.group({
      choices: this.fb.array([]),
      selectedChoice: new FormControl(),
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
      let i = 0;
      this.answers.forEach(answer => {
        if (answer.isCorrect) {
          this.form.patchValue({
            selectedChoice: `${i}`,
          });
        }
        this.choices.push(this.fb.group({
          text: answer.answerText,
          isCorrect: answer.isCorrect,
          image: answer.answerImg,
          isFormula: answer.isFormula,
        }));
        i++;
      })
    }
    this.loading = false;
  }

}
