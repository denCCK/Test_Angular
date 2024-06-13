import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Answer} from "../../../models/answer";
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {MathJaxService} from "../../../service/MathJaxService";

@Component({
  selector: 'app-testsession-answers-single',
  templateUrl: './testsession-answers-single.component.html',
  styleUrl: './testsession-answers-single.component.css'
})
export class TestsessionAnswersSingleComponent implements OnChanges {
  @Input() data: any;
  @Input() answers: Answer[] = [];
  @Input() userAnswers: Answer[] = [];
  @Output() formChange = new EventEmitter<FormGroup>();

  form: FormGroup;
  loading: boolean = true;


  constructor(private fb: FormBuilder, private mathJaxService: MathJaxService, private sanitizer: DomSanitizer) {
    this.form = this.fb.group({
      choices: this.fb.array([]),
      selectedChoice: new FormControl(`${0}`)
    });
    this.addChoice();
    this.form.valueChanges.subscribe(() => this.formChange.emit(this.form));
  }

  get choices() {
    return this.form.get('choices') as FormArray;
  }

  get selectedChoiceControl(): FormControl {
    return this.form.get('selectedChoice') as FormControl;
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
    if (this.answers != undefined) {
      this.choices.clear();
      if (this.userAnswers.length != 0) {
        let i = 0;
        this.userAnswers.forEach(userAnswer => {
          if (userAnswer.isCorrect) this.form.patchValue({
            selectedChoice: `${i}`
          });
          this.choices.push(this.fb.group({
            text: userAnswer.answerText,
            image: userAnswer.answerImg,
            isCorrect: userAnswer.isCorrect,
            isFormula: userAnswer.isFormula,
            matchText: null,
            matchImage: null,
            answerFormula: null
          }));
          i++;
        });
      } else {
        let i = 0;
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
          i++;
        });
      }
      this.loading = false;
    }
  }

  renderMath(value: string): SafeHtml {
    this.mathJaxService.renderMathJax();
    return this.sanitizer.bypassSecurityTrustHtml(`\\(${value}\\)`);
  }

}
