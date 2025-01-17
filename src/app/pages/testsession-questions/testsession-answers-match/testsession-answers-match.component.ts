import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Answer} from "../../../models/answer";
import {FormArray, FormBuilder, FormGroup} from "@angular/forms";
import {MathJaxService} from "../../../service/MathJaxService";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

@Component({
  selector: 'app-testsession-answers-match',
  templateUrl: './testsession-answers-match.component.html',
  styleUrl: './testsession-answers-match.component.css'
})
export class TestsessionAnswersMatchComponent implements OnChanges {
  @Input() data: any;
  @Input() answers: Answer[] = [];
  @Input() userAnswers: Answer[] = [];
  @Output() formChange = new EventEmitter<FormGroup>();

  form: FormGroup;
  answerMatches: string[] = [];
  loading: boolean = true;

  constructor(private fb: FormBuilder, private mathJaxService: MathJaxService, private sanitizer: DomSanitizer) {
    this.form = this.fb.group({
      matches: this.fb.array([]),
    });
    this.form.valueChanges.subscribe(() => this.formChange.emit(this.form));
  }

  get matches() {
    return this.form.get('matches') as FormArray;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['answers'] && this.answers) {
      this.loadAnswers();
    }
  }

  shuffleArray<T>(array: T[]): T[] {
    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  }

  private loadAnswers() {
    if (this.answers != undefined) {
      this.matches.clear();
      this.answerMatches  = [];
      this.answers.forEach(answer => {
        this.answerMatches.push(answer.complianceText);
      });
      this.answerMatches = this.shuffleArray(this.answerMatches);
      if (this.userAnswers.length != 0) {
        this.userAnswers.forEach(userAnswer => {
          this.matches.push(this.fb.group({
            text: userAnswer.answerText,
            image: null,//
            isCorrect: null,//
            isFormula: userAnswer.isFormula,
            matchText: userAnswer.complianceText,
            matchImage: null,//
            isMatchFormula: userAnswer.isComplianceFormula,
            answerFormula: null
          }));
          // this.answers.forEach(answer => {
          //   this.answerMatches.push(answer.complianceText);
          // });
          // this.answerMatches.push(userAnswer.complianceText);
        });
      } else {
        this.answers.forEach(answer => {
          this.matches.push(this.fb.group({
            text: answer.answerText,
            image: null,
            isCorrect: null,
            isFormula: answer.isFormula,
            matchText: null,
            matchImage: null,
            isMatchFormula: answer.isComplianceFormula,
            answerFormula: null
          }));
          //this.answerMatches.push(answer.complianceText);
        });
      }
      console.log(this.answerMatches);
    }
    this.loading = false;
  }

  renderMath(value: string): SafeHtml {
    this.mathJaxService.renderMathJax();
    return this.sanitizer.bypassSecurityTrustHtml(`\\(${value}\\)`);
  }

}
