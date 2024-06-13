import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Question} from "../../models/question";
import {QuestionService} from "../../service/QuestionService";
import {User} from "../../models/user";
import {Test} from "../../models/test";
import {UserService} from "../../service/UserService";
import {TestService} from "../../service/TestService";
import {max} from "rxjs";

@Component({
  selector: 'app-test-gen-overlay',
  templateUrl: './test-gen-overlay.component.html',
  styleUrl: './test-gen-overlay.component.css'
})
export class TestGenOverlayComponent implements OnInit {
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  form: FormGroup;
  currentStep: number = 0;
  steps = ['Название', 'Описание', 'Фильтрация'];

  errorMessage: string = '';
  averageDifficulty!: number;
  requiredTheoryCount!: number;
  requiredPracticalCount!: number;

  readonly minDifficulty = 1;
  readonly maxDifficulty = 5;
  readonly sliderDifficultyStep = 1;
  readonly difficultySteps = (this.maxDifficulty - this.minDifficulty) / this.sliderDifficultyStep;
  readonly difficultyQuantum = 0.00001;
  difficulty: FormControl = new FormControl([this.minDifficulty, this.maxDifficulty]);

  readonly minTheory = 0;
  readonly maxTheory = 100;
  readonly sliderStep = 10;
  readonly theorySteps = (this.maxTheory - this.minTheory) / this.sliderStep;
  readonly theoryQuantum = 0.01;
  theory: FormControl = new FormControl(50);

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private questionService: QuestionService,
    private fb: FormBuilder,
    private userService: UserService,
    private testService: TestService
  ) {
    this.form = this.fb.group({
      testTitle: new FormControl('Название'),
      testDescription: new FormControl('Описание'),
      theme: [''],
      questionCount: new FormControl(),
      enableTheme: [true],
      enableQuestionCount: [true],
      enableDifficulty: [true],
      enableTheoryPercentage: [true],
      filteredQuestions: new FormControl()
    });
  }

  canNavigateToStep(step: number): boolean {
    if (step <= this.currentStep) {
      return true;
    }
    return false;
  }

  setStep(index: number): void {
    this.currentStep = index;
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  nextStep(): void {
    if (this.currentStep < 7 && this.isStepValid(this.currentStep)) {
      this.currentStep++;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 0:
        return this.form.controls['testTitle'].valid;
      case 1:
        return this.form.controls['testDescription'].valid;
      case 2:
        return this.form.controls['filteredQuestions'].valid;
      default:
        return true;
    }
  }

  ngOnInit(): void {
    this.questionService.getQuestions().subscribe(questions => {
      this.questions = questions;
    });
  }



  filterQuestions() {
    let { theme, questionCount, enableTheme, enableQuestionCount, enableDifficulty, enableTheoryPercentage } = this.form.value;
    let minDifficulty = this.difficulty.value[0];
    let maxDifficulty = this.difficulty.value[1];
    let theoryPercentage = this.theory.value
    let selectedQuestions = this.questions;
    let questionsLength = this.questions.length;

    if (!enableQuestionCount) {
      questionCount = 1;
    }

    if (enableTheme) {
      selectedQuestions = selectedQuestions.filter(q => q.theme === theme);
    }

    if (enableDifficulty) {
      selectedQuestions = selectedQuestions.filter(q =>
        q.difficulty >= minDifficulty && q.difficulty <= maxDifficulty
      );
    }

    const theoryQuestions = selectedQuestions.filter(q => q.questionType == "theoretical");
    const practicalQuestions = selectedQuestions.filter(q => q.questionType == "practical");

    if (enableTheoryPercentage) {
      while (questionsLength >= questionCount) {
        this.requiredTheoryCount = Math.round(questionsLength * (theoryPercentage / 100));
        this.requiredPracticalCount = questionsLength - this.requiredTheoryCount;

        let selectedTheoryQuestions = theoryQuestions.slice(0, this.requiredTheoryCount);
        let selectedPracticalQuestions = practicalQuestions.slice(0, this.requiredPracticalCount);

        let combinedQuestions = [...selectedTheoryQuestions, ...selectedPracticalQuestions];

        if (combinedQuestions.length < questionCount) {
          this.filteredQuestions = [];
        } else {
          if (enableQuestionCount) {
            if (combinedQuestions.length == questionCount) {
              this.errorMessage = '';
              this.filteredQuestions = combinedQuestions;
              break;
            }
          } else {
            this.errorMessage = '';
            this.filteredQuestions = combinedQuestions;
            break;
          }
        }
        questionsLength--;
      }
      if (this.filteredQuestions.length == 0) {
        this.errorMessage = 'Недостаточно вопросов для выбора с заданными параметрами или средняя сложность не попадает в заданный диапазон';
      }
    } else {
      this.errorMessage = '';
      this.filteredQuestions = selectedQuestions;
    }

    this.averageDifficulty = this.calculateAverageDifficulty(this.filteredQuestions);
    this.requiredTheoryCount = Math.round(this.filteredQuestions.length * (theoryPercentage / 100));
    this.requiredPracticalCount = this.filteredQuestions.length - this.requiredTheoryCount;

  }

  calculateAverageDifficulty(questions: Question[]): number {
    if (questions.length === 0) return 0;
    const totalDifficulty = questions.reduce((sum, question) => sum + question.difficulty, 0);
    return totalDifficulty / questions.length;
  }

  closeOverlay() {
    this.close.emit();
  }

  onSubmit() {
    if (this.form.valid) {
      const formData = this.form.value;
      this.userService.getUserById(1).subscribe(
        (user: User) => {
          const newTest: Test = {
            id: 0,
            testName: formData.testTitle,
            testDescription: formData.testDescription,
            creationDate: new Date(),
            lastChangeDate: new Date(),
            user: user,
            questions: this.filteredQuestions
          };

          this.testService.createTest(newTest).subscribe(
            (test: Test) => {
              this.close.emit();
            },
            error => {
              console.error('Error creating test:', error);
            }
          );

        },
        error => {
          console.error('Error fetching user:', error);
        }
      );
    }
  }

  removeQuestion(selectedQuestion: Question): void {
    const index = this.filteredQuestions.findIndex(q => q.id === selectedQuestion.id);
    if (index !== -1) {
      this.filteredQuestions.splice(index, 1);
    }
  }

  protected readonly max = max;
}
