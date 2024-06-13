import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Answer} from "../../../models/answer";
import {FormBuilder, FormGroup} from "@angular/forms";
import {AnswerService} from "../../../service/AnswerService";
import {MathJaxService} from "../../../service/MathJaxService";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-testsession-answers-open',
  templateUrl: './testsession-answers-open.component.html',
  styleUrl: './testsession-answers-open.component.css'
})
export class TestsessionAnswersOpenComponent implements OnChanges {
  @Input() questionId: number | null = null;
  @Input() answers: Answer[] = [];
  @Input() userAnswers: Answer[] = [];
  @Output() formChange = new EventEmitter<FormGroup>();

  form: FormGroup;
  loading: boolean = true;


  constructor(private fb: FormBuilder, private sanitizer: DomSanitizer, private mathJaxService: MathJaxService) {
    this.form = this.fb.group({
      text: '',
      isFormula: null,
      isCorrect: null,
      image: null,
      matchText: null,
      matchImage: null,
      answerFormula: null
    });
    this.form.valueChanges.subscribe(() => this.formChange.emit(this.form));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['answers'] && this.answers) {
      if (this.userAnswers.length != 0) {
        console.log(this.userAnswers)
        this.form.patchValue({
          text: this.userAnswers[0].answerText,
          isFormula: this.userAnswers[0].isFormula,
        });
      } else {
        this.form.patchValue({
          text: '',
          isFormula: false,
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
