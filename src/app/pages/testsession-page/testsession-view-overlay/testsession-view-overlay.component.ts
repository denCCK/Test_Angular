import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {TestsessionResultService} from "../../../service/TestsessionResultService";
import {TestsessionQuestionResultService} from "../../../service/TestsessionQuestionResultService";
import {TestsessionAnswerResultService} from "../../../service/TestsessionAnswerResultService";
import {TestsessionAnswerResult} from "../../../models/testsessionAnswerResult";
import {TestsessionQuestionResult} from "../../../models/testsessionQuestionResult";
import {TestsessionResult} from "../../../models/testsessionResult";
import {Testsession} from "../../../models/testsession";
import {finalize, Observable, of, tap} from "rxjs";
import {TestService} from "../../../service/TestService";
import {Test} from "../../../models/test";
import {Question} from "../../../models/question";
import {AnswerService} from "../../../service/AnswerService";
import {QuestionService} from "../../../service/QuestionService";
import {TUI_ALWAYS_DASHED, TUI_ALWAYS_NONE} from "@taiga-ui/addon-charts";
import {GradeService} from "../../../service/GradeService";
import {Grade} from "../../../models/grade";
import {tuiCeil, tuiPure} from "@taiga-ui/cdk";
import {Answer} from "../../../models/answer";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {MathJaxService} from "../../../service/MathJaxService";

@Component({
  selector: 'app-testsession-view-overlay',
  templateUrl: './testsession-view-overlay.component.html',
  styleUrl: './testsession-view-overlay.component.css'
})
export class TestsessionViewOverlayComponent implements OnChanges {

  @Input() isVisible: boolean = false;
  @Input() testsession!: Testsession;
  @Output() close = new EventEmitter<void>();

  test!: Test;
  questions!: Question[];
  answers: Answer[] = [];

  testsessionResults!: TestsessionResult[];
  testsessionQuestionResults!: TestsessionQuestionResult[];
  testsessionAnswerResults!: TestsessionAnswerResult[];
  testsessionGrades!: Grade[];

  userTestsessionQuestionResults: ReadonlyArray<[number, TestsessionQuestionResult[]]> = [];
  userTestsessionAnswerResults: ReadonlyArray<[number, TestsessionAnswerResult[]]> = [];
  userResults: ReadonlyArray<[TestsessionQuestionResult, TestsessionAnswerResult[]]> = [];
  userGrade: Array<[number, string]> = [];

  selectedTestsessionResult!: TestsessionResult;

  allTestsessionQuestionResults: TestsessionQuestionResult[] = [];

  isTestsessionResultOverlayVisible: boolean = false;
  viewOverlayLoading: boolean = true;

  link!: string;

  testsessionResultValue: Array<[number, number]> = [];
  rightQuestions: number[] = [];
  wrongQuestions: number[] = [];
  chartData: ReadonlyArray<number[]> = [];
  axisXLabels: string[] = [];
  axisYSecondaryLabels: string[] = [];
  maxValue = 0;

  readonly horizontalLinesHandler = TUI_ALWAYS_DASHED;
  readonly verticalLinesHandler = TUI_ALWAYS_NONE;

  resultLoading: boolean = true;

  isQuestionViewOverlayVisible: boolean = false;
  selectedQuestion!: Question;
  selectedAnswers!: Answer[];

  constructor(
    private testsessionResultService: TestsessionResultService,
    private testsessionQuestionResultService: TestsessionQuestionResultService,
    private testsessionAnswerResultService: TestsessionAnswerResultService,
    private testService: TestService,
    private gradeService: GradeService,
    private answerService: AnswerService,
    private questionService: QuestionService,
    private mathJaxService: MathJaxService,
    private sanitizer: DomSanitizer
  ) { }

  calculateGrade(testsessionResultId: number): void {
    let userPoints: number = 0;
    let gradeIndex: number = 0;
    this.findTestsessionQuestionResultsByTestsessionResultId(testsessionResultId).forEach(testsessionResult => {
      userPoints += testsessionResult.point;
    });
    let i = 0;
    console.log(this.testsessionGrades)
    for (const grade of  this.testsessionGrades) {
      if (userPoints > grade.gradeValue) {
        gradeIndex = i;
      }
      i++;
    }
    this.userGrade.push([testsessionResultId, this.testsessionGrades[gradeIndex].gradeName]);
  }

  getUserGradeByKey(key: number): string | undefined {
    const gradeTuple = this.userGrade.find(([k, _]) => k === key);
    return gradeTuple ? gradeTuple[1] : undefined;
  }


  navigateToQuestion(questionId: number): Question | undefined {
    return this.questions.find(q => q.id === questionId)
  }

  addUserResults(testsessionQuestionResult: TestsessionQuestionResult, testsessionAnswerResults: TestsessionAnswerResult[]): void {
    this.userResults = [...this.userResults, [testsessionQuestionResult, testsessionAnswerResults]];

    const index = this.userResults.findIndex(entry => entry[0] === testsessionQuestionResult);

    if (index !== -1) {
      this.userResults = this.userResults.map((entry, i) =>
        i === index ? [testsessionQuestionResult, testsessionAnswerResults] : entry
      );
    } else {
      this.userResults = [...this.userResults, [testsessionQuestionResult, testsessionAnswerResults]];
    }
  }

  findUserResultByTestsessionQuestionResultId(testsessionQuestionResultId: number): TestsessionAnswerResult[] {
    const found = this.userResults.find(([testsessionQuestionResult, testsessionAnswerResults]) => testsessionQuestionResult.id === testsessionQuestionResultId);
    return found ? found[1] : [];
  }

  addTestsessionQuestionResult(testsessionResultId: number, testsessionQuestionResults: TestsessionQuestionResult[]): void {
    this.userTestsessionQuestionResults = [...this.userTestsessionQuestionResults, [testsessionResultId, testsessionQuestionResults]];
  }

  findTestsessionQuestionResultsByTestsessionResultId(testsessionResultId: number): TestsessionQuestionResult[] {
    const found = this.userTestsessionQuestionResults.find(([id, testsessionQuestionResults]) => id === testsessionResultId);
    return found ? found[1] : [];
  }

  addTestsessionAnswerResult(testsessionResultId: number, testsessionAnswerResults: TestsessionAnswerResult[]): void {
    this.userTestsessionAnswerResults = [...this.userTestsessionAnswerResults, [testsessionResultId, testsessionAnswerResults]];
  }

  findTestsessionAnswerResultsByTestsessionResultId(testsessionResultId: number): TestsessionAnswerResult[] {
    const found = this.userTestsessionAnswerResults.find(([id, testsessionAnswerResults]) => id === testsessionResultId);
    return found ? found[1] : [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['testsession'] && changes['testsession'].currentValue !== changes['testsession'].previousValue) {
      if (this.testsession) {
        this.loadTestsessionResults();
      }
    }
  }

  loadTestsessionResults(): void {
    this.resultLoading = true;
    this.link = "http://localhost:4200/testsession/" + this.testsession.id + "/start";
    this.allTestsessionQuestionResults = [];
    this.userTestsessionQuestionResults = [];
    this.userTestsessionAnswerResults = [];
    this.axisXLabels = [];
    this.testsessionResultValue = [];
    this.rightQuestions = [];
    this.wrongQuestions = [];

    this.testsessionResultService.getTestsessionResultsByTestsessionId(this.testsession.id).subscribe((testsessionResults) => {
      this.testsessionResults = testsessionResults;

      testsessionResults.forEach(testsessionResult => {

        this.gradeService.getGradesByTestsessionId(this.testsession.id).pipe(
          tap(grades => {
            this.testsessionGrades = grades.sort((a, b) => a.gradeValue - b.gradeValue);
          }),
          finalize(() => {

          })
        ).subscribe();

        this.testsessionQuestionResultService.getQuestionResultsByTestsessionResultId(testsessionResult.id).pipe(
          tap(testsessionQuestionResults => {
            this.addTestsessionQuestionResult(testsessionResult.id, testsessionQuestionResults);
            testsessionQuestionResults.forEach(testsessionQuestionResult => {
              this.allTestsessionQuestionResults.push(testsessionQuestionResult);
            });
          }),
          finalize(() => {
            this.calculateGrade(testsessionResult.id);
          })
        ).subscribe();

        this.testsessionAnswerResultService.getAnswerResultsByTestsessionResultId(testsessionResult.id).pipe(
          tap(testsessionAnswerResults => {
            this.addTestsessionAnswerResult(testsessionResult.id, testsessionAnswerResults);
          }),
          finalize(() => {
          })
        ).subscribe();

      });

      this.testService.getTestById(this.testsession.testId).pipe(
        tap(test => {
          this.test = test;
        }),
        finalize(() => {
          this.questions = this.test.questions;
          this.questions.forEach(question => {
            this.answerService.getAnswersByQuestionId(question.id).pipe(
              tap(answers => {
                answers.forEach(answer =>{
                  this.answers.push(answer);
                });
              }),
              finalize(() => {
                console.log(this.answers);
              })
            ).subscribe();
            this.axisXLabels.push(question.questionName);
            let right = 0;
            let wrong = 0;
            this.allTestsessionQuestionResults.forEach(testsessionQuestionResult => {
              if (testsessionQuestionResult.questionId == question.id) {
                if (testsessionQuestionResult.isCorrect) right++;
                else wrong++;
              }
            });
            this.rightQuestions.push(right);
            this.wrongQuestions.push(wrong);
            this.testsessionResultValue.push([right, wrong]);
          });
          this.maxValue = this.getMax(this.testsessionResultValue);
          this.axisYSecondaryLabels = [
            '',
            `${this.maxValue / 2}`,
            `${this.maxValue}`,
          ];
          this.chartData = [this.rightQuestions, this.wrongQuestions];
          this.resultLoading = false;
        })
      ).subscribe();

    });
  }

  closeOverlay(): void {
    this.close.emit();
  }

  showViewOverlay(testsessionResultId: number): void {
    this.testsessionResults.forEach(testsessionResult => {
      if (testsessionResult.id == testsessionResultId) {
        this.selectedTestsessionResult = testsessionResult
      }
    });
    this.userResults = [];
    this.isTestsessionResultOverlayVisible = true;
    this.testsessionQuestionResults = this.findTestsessionQuestionResultsByTestsessionResultId(testsessionResultId);
    this.testsessionAnswerResults = this.findTestsessionAnswerResultsByTestsessionResultId(testsessionResultId);

    this.testsessionQuestionResults.forEach(testsessionQuestionResult => {
      let testsessionAnswerResults: TestsessionAnswerResult[] = [];
      this.testsessionAnswerResults.forEach(testsessionAnswerResult => {
        if (testsessionAnswerResult.questionId == testsessionQuestionResult.questionId) {
          testsessionAnswerResults.push(testsessionAnswerResult);
        }
      });
      this.addUserResults(testsessionQuestionResult, testsessionAnswerResults);
    });
  }

  hideViewOverlay() {
    this.isTestsessionResultOverlayVisible = false;
  }

  getQuestionPoint(testsessionResultId: number, questionId: number): number {
    const questionResult = this.findTestsessionQuestionResultsByTestsessionResultId(testsessionResultId).find(
      result => result.questionId === questionId
    );
    return questionResult ? questionResult.point : 0;
  }

  getResultClass(testsessionResultId: number, questionId: number): string {
    const questionResult = this.findTestsessionQuestionResultsByTestsessionResultId(testsessionResultId).find(
      result => result.questionId === questionId
    );
    return questionResult ? (questionResult.isCorrect ? 'correct' : 'incorrect') : '';
  }

  @tuiPure
  private getMax(value: ReadonlyArray<[number, number]>): number {
    return tuiCeil(
      value.reduce((max, value) => Math.max(...value, max), 0),
      -1,
    );
  }

  getBackground(index: number): string {
    return `var(--tui-chart-${index})`;
  }

  getSetName(index: number): string {
    return index % 2 == 0 ? 'Верно' : 'Неверно';
  }

  showQuestionOverlay(questionId: number) {
    this.questions.forEach(question => {
      if (question.id == questionId) {
        this.selectedQuestion = question;
      }
    });
    this.answerService.getAnswersByQuestionId(questionId).pipe(
      tap(answers => {
        this.selectedAnswers = answers;
      }),
      finalize(() => {
        this.isQuestionViewOverlayVisible = true;
      })
    ).subscribe();
  }

  hideQuestionOverlay() {
    this.isQuestionViewOverlayVisible = false;
  }

  getQuestionClass(id: number) {
    const question = this.questions.find(
      result => result.id === id
    );
    if (question?.questionType == 'practical') {
      return 'practical';
    } else if (question?.questionType == 'theoretical') {
      return 'theoretical';
    } else {
      return '';
    }
  }

  renderMath(value: string | undefined): SafeHtml {
    this.mathJaxService.renderMathJax();
    return this.sanitizer.bypassSecurityTrustHtml(`\\(${value}\\)`);
  }

  getAnswerTypeName(answerType: string): string {
    switch (answerType) {
      case 'single':
        return 'Одиночный';
      case 'multiple':
        return 'Множественный';
      case 'match':
        return 'Соответствие';
      case 'open':
        return 'Открытый';
      default:
        return '';
    }
  }

  getQuestionTypeName(questionType: string): string {
    switch (questionType) {
      case 'practical':
        return 'Практический';
      case 'theoretical':
        return 'Теоретический';
      default:
        return '';
    }
  }

  getIsCorrectName(isCorrect: boolean | undefined): string {
    if (isCorrect) return 'Верно'
    return 'Неверно'
  }

  getAnswerById(id: number): Answer | undefined {
    const answer = this.answers.find(
      result => result.id === id
    );
    return answer;
  }
}
