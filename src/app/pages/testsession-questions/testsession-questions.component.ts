import {Component, HostListener, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Question} from "../../models/question";
import {TestsessionService} from "../../service/TestsessionService";
import {ActivatedRoute, Router} from "@angular/router";
import {finalize, tap} from "rxjs";
import {Testsession} from "../../models/testsession";
import {TestService} from "../../service/TestService";
import {Test} from "../../models/test";
import {AnswerService} from "../../service/AnswerService";
import {Answer} from "../../models/answer";
import {TestsessionResult} from "../../models/testsessionResult";
import {TestsessionQuestionResult} from "../../models/testsessionQuestionResult";
import {TestsessionAnswerResult} from "../../models/testsessionAnswerResult";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {TestsessionResultService} from "../../service/TestsessionResultService";
import {TestsessionQuestionResultService} from "../../service/TestsessionQuestionResultService";
import {TestsessionAnswerResultService} from "../../service/TestsessionAnswerResultService";

@Component({
  selector: 'app-testsession-questions',
  templateUrl: './testsession-questions.component.html',
  styleUrl: './testsession-questions.component.less'
})
export class TestsessionQuestionsComponent implements OnInit, OnChanges {
  testsessionId: number;
  testsession!: Testsession;
  test!: Test;
  questions: Question[] = [];
  questionAnswers: ReadonlyArray<[number, Answer[]]> = [];
  userAnswers: ReadonlyArray<[number, Answer[]]> = [];

  currentQuestionIndex: number = 0;
  currentQuestion!: Question;
  currentAnswers!: Answer[];
  currentUserAnswers!: Answer[];

  testsessionResult!: TestsessionResult;
  testsessionQuestionResults: TestsessionQuestionResult[] = [];
  testsessionAnswerResults: TestsessionAnswerResult[] = [];

  name!: string;
  surname!: string;
  loading: boolean = true;

  remainingTime: number = 0;
  timerRunning: boolean = false;

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private testsessionService: TestsessionService,
    private testsessionResultService: TestsessionResultService,
    private testsessionQuestionResultService: TestsessionQuestionResultService,
    private testsessionAnswerResultService: TestsessionAnswerResultService,
    private testService: TestService,
    private answerService: AnswerService
  ) {
    this.form = this.fb.group({
      answers: new FormControl()
    });
    this.testsessionId = this.route.snapshot.params['testsessionId'];
  }

  saveState() {
    const state = {
      testsessionId: this.testsessionId,
      currentQuestion: this.currentQuestion,
      currentQuestionIndex: this.currentQuestionIndex,
      currentAnswers: this.currentAnswers,
      currentUserAnswers: this.currentUserAnswers,
      remainingTime: this.remainingTime,
      userAnswers: this.userAnswers,
      questions: this.questions,
      test: this.test,
      questionAnswers: this.questionAnswers,
      testsessionResult: this.testsessionResult,
      testsessionQuestionsResults: this.testsessionQuestionResults,
      testsessionAnswerResults: this.testsessionAnswerResults
    };
    localStorage.setItem('testsessionState', JSON.stringify(state));
  }

  @HostListener('window:beforeunload')
  ngOnDestroy() {
    this.saveState();
  }

  loadState() {
    const savedState = localStorage.getItem('testsessionState');
    if (savedState) {
      const state = JSON.parse(savedState);
      this.testsessionId = state.testsessionId;
      this.currentQuestion = state.currentQuestion;
      this.currentQuestionIndex = state.currentQuestionIndex;
      this.currentAnswers = state.currentAnswers;
      this.currentUserAnswers = state.currentUserAnswers;
      this.remainingTime = state.remainingTime;
      this.userAnswers = state.userAnswers;
      this.questions = state.questions;
      this.questionAnswers = state.questionAnswers;
      this.testsessionResult = state.testsessionResult;
      this.testsessionQuestionResults = state.testsessionQuestionResults;
      this.testsessionAnswerResults = state.testsessionAnswerResults;
      this.test = state.test;
      this.selectQuestion(state.currentQuestionIndex);
      this.startTimer(new Date(state.remainingTime * 1000));
    }
  }


  startTimer(time: Date) {
    const newTime = new Date(time);
    this.remainingTime = newTime.getHours() * 3600 + newTime.getMinutes() * 60;
    this.timerRunning = true;
    const interval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 0) {
        clearInterval(interval);
        this.timerRunning = false;
        this.endTestsession();
      }
    }, 1000);
  }

  formatTime(timeInSeconds: number): string {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${this.padNumber(hours)}:${this.padNumber(minutes)}:${this.padNumber(seconds)}`;
  }

  padNumber(num: number): string {
    return num < 10 ? `0${num}` : `${num}`;
  }

  calculateAverageDifficulty(questions: Question[]): number {
    if (questions.length === 0) {
      return 0;
    }

    const totalDifficulty = questions.reduce((sum, question) => sum + question.difficulty, 0);
    return totalDifficulty / questions.length;
  }

  calculateQuestionTypePercentage(questions: Question[]): { theory: number, practice: number } {
    const totalQuestions = questions.length;
    const theoryQuestions = questions.filter(question => question.questionType === 'теория').length;
    const practiceQuestions = totalQuestions - theoryQuestions;

    const theoryPercentage = (theoryQuestions / totalQuestions) * 100;
    const practicePercentage = (practiceQuestions / totalQuestions) * 100;

    return { theory: theoryPercentage, practice: practicePercentage };
  }

  selectRandomItems<T>(array: T[], count: number): T[] {
    const shuffledArray = array.sort(() => Math.random() - 0.5);
    return shuffledArray.slice(0, count);
  }

  selectRandomQuestions(questions: Question[], desiredDifficulty: number, practicalCount: number, theoryCount: number, totalCount: number): Question[] {
    const filteredQuestions = questions.filter(question =>
      Math.abs(question.difficulty - desiredDifficulty) < 0.5
    );

    const practicalQuestions = filteredQuestions.filter(question => question.questionType === 'практика');
    const theoryQuestions = filteredQuestions.filter(question => question.questionType === 'теория');

    if (practicalQuestions.length < practicalCount || theoryQuestions.length < theoryCount) {
      return [];
    }

    const selectedPracticalQuestions = this.selectRandomItems(practicalQuestions, practicalCount);
    const selectedTheoryQuestions = this.selectRandomItems(theoryQuestions, theoryCount);

    return [...selectedPracticalQuestions, ...selectedTheoryQuestions];
  }

  generateQuestionSample(questions: Question[], sampleSize: number): Question[] {
    const averageDifficulty = this.calculateAverageDifficulty(questions);

    const { theory, practice } = this.calculateQuestionTypePercentage(questions);

    let theoryCount = Math.round((theory / 100) * sampleSize);
    let practiceCount = Math.round((practice / 100) * sampleSize);

    let selectedQuestions = this.selectRandomQuestions(questions, averageDifficulty, practiceCount, theoryCount, sampleSize);

    if (selectedQuestions.length === 0) {
      const remainingCount = sampleSize - selectedQuestions.length;

      const remainingTheoryCount = Math.floor((theory / 100) * remainingCount);
      const remainingPracticeCount = remainingCount - remainingTheoryCount;

      const additionalQuestions = this.selectRandomQuestions(questions, averageDifficulty, remainingPracticeCount, remainingTheoryCount, remainingCount);

      selectedQuestions = [...selectedQuestions, ...additionalQuestions];
    }

    if (selectedQuestions.length === 0) {
      selectedQuestions = this.selectRandomQuestions(questions, averageDifficulty, sampleSize, 0, sampleSize);
    }

    if (selectedQuestions.length === 0) {
      selectedQuestions = this.selectRandomItems(questions, sampleSize);
    }

    return selectedQuestions;
  }

  addQuestionAnswer(questionId: number, answers: Answer[]): void {
    this.questionAnswers = [...this.questionAnswers, [questionId, answers]];
  }

  findQuestionAnswersByQuestionId(questionId: number): Answer[] {
    const found = this.questionAnswers.find(([id, answers]) => id === questionId);
    return found ? found[1] : [];
  }

  addUserAnswer(questionId: number, answers: Answer[]): void {
    const index = this.userAnswers.findIndex(entry => entry[0] === questionId);

    if (index !== -1) {
      this.userAnswers = this.userAnswers.map((entry, i) =>
        i === index ? [questionId, answers] : entry
      );
    } else {
      this.userAnswers = [...this.userAnswers, [questionId, answers]];
    }
  }

  findUserAnswersByQuestionId(questionId: number): Answer[] {
    const found = this.userAnswers.find(([id, answers]) => id === questionId);
    return found ? found[1] : [];
  }

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {
      this.name = params['name'];
      this.surname = params['surname'];
    });

    // const savedState = localStorage.getItem('testsessionState');
    // if (savedState) {
    //   this.loadState();
    // }

    this.testsessionService.getTestsessionById(this.testsessionId).pipe(
      tap(testsession => {
        this.testsession = testsession;
      }),
      finalize(() => {
        this.testsessionResult = new TestsessionResult(
          0,
          this.testsession.id,
          this.name,
          this.surname,
          0,
          new Date(),
          new Date(),
        );
        this.testService.getTestById(this.testsession.testId).pipe(
          tap(test => {
            this.test = test;
          }),
          finalize(() => {
            if (this.testsession.questionsCount && this.testsession.questionsCount != this.test.questions.length) {
              this.questions = this.generateQuestionSample(this.test.questions, this.testsession.questionsCount);
            } else {
              this.questions = this.test.questions;
            }
            console.log(this.questions);
            let i = 0;
            this.questions.forEach(question => {
              this.answerService.getAnswersByQuestionId(question.id).pipe(
                tap(answers => {
                  this.addQuestionAnswer(question.id, answers);
                }),
                finalize(() => {
                  i++;
                  if (this.questions.length == i) {
                    this.selectQuestion(0);
                    this.loading = false;
                    console.log(this.testsession.testsessionTime);
                    this.startTimer(this.testsession.testsessionTime);
                  }
                })
              ).subscribe();
            });
          })
        ).subscribe();
      })
    ).subscribe();

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['testsession'] && changes['testsession'].currentValue !== changes['testsession'].previousValue) {
      if (this.testsession) {
      }
    }
  }

  selectQuestion(index: number): void {
    if (this.currentQuestion) {
      const userAnswers = this.extractAnswersFromFormData(this.form.value, this.currentQuestion);
      this.addUserAnswer(this.currentQuestion.id, userAnswers);
    }

    this.currentQuestionIndex = index;
    this.currentQuestion = this.questions[index];
    this.currentAnswers = this.findQuestionAnswersByQuestionId(this.currentQuestion.id);

    this.currentUserAnswers = this.findUserAnswersByQuestionId(this.currentQuestion.id);
  }

  extractAnswersFromFormData(formData: any, question: Question): Answer[] {
    const answers: Answer[] = [];

    switch (question.answersType) {
      case "open":
        const answer: Answer = {
          id: this.currentAnswers[0].id,
          answerText: formData.answers.text,
          answerImg: formData.answers.image,
          isCorrect: formData.answers.isCorrect,
          isFormula: formData.isFormula,
          complianceText: formData.matchText,
          complianceImg: formData.matchImage,
          isComplianceFormula: formData.isComplianceFormula,
          question: question,
          answerFormula: formData.answers.answerFormula
        };
        answers.push(answer);
        break;

      case "multiple":
        for (let i = 0; i < formData.answers.choices.length; i++) {
          const answerData = formData.answers.choices[i];
          const answer: Answer = {
            id: this.currentAnswers[i].id,
            answerText: answerData.text,
            answerImg: answerData.image,
            isCorrect: answerData.isCorrect,
            isFormula: answerData.isFormula,
            complianceText: answerData.matchText,
            complianceImg: answerData.matchImage,
            isComplianceFormula: answerData.isComplianceFormula,
            question: question,
            answerFormula: answerData.answerFormula
          };
          answers.push(answer);
        }
        break;

      case "match":
        for (let i = 0; i < formData.answers.matches.length; i++) {
          const answerData = formData.answers.matches[i];
          const answer: Answer = {
            id: this.currentAnswers[i].id,
            answerText: answerData.text,
            answerImg: answerData.image,
            isCorrect: answerData.isCorrect,
            isFormula: answerData.isFormula,
            complianceText: answerData.matchText,
            complianceImg: answerData.matchImage,
            isComplianceFormula: answerData.isComplianceFormula,
            question: question,
            answerFormula: answerData.answerFormula
          };
          answers.push(answer);
        }
        break;

      case "single":
        for (let i = 0; i < formData.answers.choices.length; i++) {
          const answerData = formData.answers.choices[i];
          if (formData.answers.selectedChoice == i) {
            answerData.isCorrect = true;
          } else {
            answerData.isCorrect = false;
          }
          const answer: Answer = {
            id: this.currentAnswers[i].id,
            answerText: answerData.text,
            answerImg: answerData.image,
            isCorrect: answerData.isCorrect,
            isFormula: answerData.isFormula,
            complianceText: answerData.matchText,
            complianceImg: answerData.matchImage,
            isComplianceFormula: answerData.isComplianceFormula,
            question: question,
            answerFormula: answerData.answerFormula
          };
          answers.push(answer);
        }
        break;
    }

    return answers;
  }

  onAnswersFormChange(formGroup: FormGroup) {
    this.form.setControl('answers', formGroup);
  }

  answersEquals(answer1: Answer, answer2: Answer): boolean {
    if (!answer2) {
      return false;
    }
    return (
      answer1.answerText === answer2.answerText &&
      answer1.answerImg === answer2.answerImg &&
      answer1.isCorrect === answer2.isCorrect &&
      answer1.complianceText === answer2.complianceText &&
      answer1.complianceImg === answer2.complianceImg &&
      answer1.question.id === answer2.question.id &&
      answer1.answerFormula === answer2.answerFormula
    );
  }

  endTestsession() {

    if (this.currentQuestion) {
      const userAnswers = this.extractAnswersFromFormData(this.form.value, this.currentQuestion);
      this.addUserAnswer(this.currentQuestion.id, userAnswers);
    }

    this.questions.forEach(question => {
      const currentUserAnswers = this.findUserAnswersByQuestionId(question.id);
      const currentAnswers = this.findQuestionAnswersByQuestionId(question.id);

      let answersLength: number = currentAnswers.length;
      let isCorrect: boolean = true;
      let rightAnswers: number = answersLength;

      currentAnswers.forEach(answer => {
        if (currentUserAnswers.length != 0) {

          currentUserAnswers.forEach(userAnswer => {

            if (userAnswer.id == answer.id) {
              // console.log(userAnswer);
              // console.log(answer);
              if (!this.answersEquals(userAnswer, answer)) {
                isCorrect = false;
                rightAnswers--;
              }
              let testsessionAnswerResult: TestsessionAnswerResult;
              testsessionAnswerResult = {
                id: 0,
                testsessionResultId: this.testsessionResult.id,
                questionId: question.id,
                answerId: answer.id,
                answerText: userAnswer.answerText,
                answerImg: userAnswer.answerImg,
                isCorrect: userAnswer.isCorrect,
                isFormula: userAnswer.isFormula,
                complianceText: userAnswer.complianceText,
                complianceImg: userAnswer.complianceImg,
                answerFormula: userAnswer.answerFormula,
                isComplianceFormula: userAnswer.isComplianceFormula
              };
              this.testsessionAnswerResults.push(testsessionAnswerResult);
            }

          });

        } else {
          isCorrect = false;
          rightAnswers = 0;
          console.log("без ответов");
          const testsessionAnswerResult: TestsessionAnswerResult = {
            id: 0,
            testsessionResultId: this.testsessionResult.id,
            questionId: question.id,
            answerId: answer.id,
            answerText: '',
            answerImg: '',
            isCorrect: false,
            isFormula: answer.isFormula,
            complianceText: '',
            complianceImg: '',
            answerFormula: '',
            isComplianceFormula: answer.isComplianceFormula
          };
          this.testsessionAnswerResults.push(testsessionAnswerResult);
        }

      });

      console.log(rightAnswers);
      const testsessionQuestionResult: TestsessionQuestionResult = {
        id: 0,
        questionId: question.id,
        isCorrect: isCorrect,
        testsessionResultId: this.testsessionResult.id,
        point: (question.questionPoint / answersLength) * rightAnswers
      };
      this.testsessionResult.point += testsessionQuestionResult.point;
      this.testsessionQuestionResults.push(testsessionQuestionResult);

    });

    this.testsessionResult.endDate = new Date();

    console.log(this.testsessionAnswerResults);
    console.log(this.testsessionQuestionResults);
    console.log(this.testsessionResult);

    this.testsessionResultService.createTestsessionResult(this.testsessionResult).pipe(
      tap(testsessionResult => {
        this.testsessionResult = testsessionResult;
      }),
      finalize(() => {

        this.testsessionAnswerResults.forEach(testsessionAnswerResult => {
          testsessionAnswerResult.testsessionResultId = this.testsessionResult.id;
          this.testsessionAnswerResultService.createTestsessionAnswerResult(testsessionAnswerResult).pipe(
            tap(testsessionAnswerResult => {
            }),
            finalize(() => {
            })
          ).subscribe();
        });

        this.testsessionQuestionResults.forEach(testsessionQuestionResult => {
          testsessionQuestionResult.testsessionResultId = this.testsessionResult.id;
          this.testsessionQuestionResultService.createTestsessionQuestionResult(testsessionQuestionResult).pipe(
            tap(testsessionQuestionResult => {
            }),
            finalize(() => {
            })
          ).subscribe()
        });

        this.router.navigate([`/testsession/end`], {
          queryParams: { name: this.name, surname: this.surname }
        });

      })
    ).subscribe();
  }

}
