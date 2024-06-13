import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Answer} from "../../../models/answer";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {MathJaxService} from "../../../service/MathJaxService";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-testsession-answers-multiple',
  templateUrl: './testsession-answers-multiple.component.html',
  styleUrl: './testsession-answers-multiple.component.css'
})
export class TestsessionAnswersMultipleComponent implements OnChanges {
  @Input() data: any;
  @Input() answers: Answer[] = [];
  @Input() userAnswers: Answer[] = [];
  @Output() formChange = new EventEmitter<FormGroup>();

  form: FormGroup;
  loading: boolean = true;


  constructor(private fb: FormBuilder, private mathJaxService: MathJaxService, private sanitizer: DomSanitizer) {
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
      isFormula: null,
      matchText: null,
      matchImage: null,
      isMatchFormula: null,
      answerFormula: null
    }));
  }

  removeChoice(index: number) {
    this.choices.removeAt(index);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['answers'] && this.answers) {
      this.loadAnswers();
    }
  }

  private loadAnswers() {
    this.loading = true;
    if (this.answers != undefined) {
      this.choices.clear();
      if (this.userAnswers.length != 0) {
        this.userAnswers.forEach(userAnswer => {
          this.choices.push(this.fb.group({
            text: userAnswer.answerText,
            image: userAnswer.answerImg,
            isCorrect: userAnswer.isCorrect,
            isFormula: userAnswer.isFormula,
            matchText: null,
            matchImage: null,
            answerFormula: null
          }));
        });
      } else {
        this.answers.forEach(answer => {
          this.choices.push(this.fb.group({
            text: answer.answerText,
            image: answer.answerImg,
            isFormula: answer.isFormula,
            isCorrect: false,
            matchText: null,
            matchImage: null,
            answerFormula: null
          }));
        });
      }
    }
    this.loading = false;
  }

  renderMath(value: string): SafeHtml {
    this.mathJaxService.renderMathJax();
    return this.sanitizer.bypassSecurityTrustHtml(`\\(${value}\\)`);
  }
}
