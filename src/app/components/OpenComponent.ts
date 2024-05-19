// open.component.ts
import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {AnswerService} from "../service/AnswerService";
import {Answer} from "../models/answer";

@Component({
  selector: 'app-open',
  template: `
    <div [formGroup]="form">
      <tui-textarea formControlName="text" placeholder="Введите ответ" />
    </div>
  `,
})
export class OpenComponent implements OnInit, OnChanges {
  @Input() questionId: number | null = null;
  @Input() answers: Answer[] = [];
  @Output() formChange = new EventEmitter<FormGroup>();

  form: FormGroup;

  constructor(private fb: FormBuilder, private answerService: AnswerService) {
    this.form = this.fb.group({
      text: '',
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
      this.form = this.fb.group({
        text: this.answers[0].answerText,
      });
    }
  }

}
