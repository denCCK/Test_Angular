import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {QuestionService} from "../../service/QuestionService";
import {AnswerService} from "../../service/AnswerService";
import {UserService} from "../../service/UserService";
import {Question} from "../../models/question";
import {TestService} from "../../service/TestService";
import {User} from "../../models/user";
import {Test} from "../../models/test";

@Component({
  selector: 'app-tests-edit-overlay',
  templateUrl: './tests-edit-overlay.component.html',
  styleUrl: './tests-edit-overlay.component.css'
})
export class TestsEditOverlayComponent implements OnInit, OnChanges {
  form: FormGroup;
  questions!: Question[];
  creationDate!: Date;
  currentStep: number = 0;
  steps = ['Название', 'Описание', 'Вопросы'];

  @Input() isVisible: boolean = false;
  @Input() testId!: number;
  @Output() close = new EventEmitter<void>();
  selectedQuestions!: Question[];
  loading: boolean = true;

  ngOnInit(): void {
    this.loadTest(this.testId);
    this.questionService.getQuestions().subscribe(
      (questions: Question[]) => {
        this.questions = questions;
      },
      error => {
        console.error('Error fetching questions:', error);
      }
    );
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
        return this.form.controls['questions'].valid;
      default:
        return true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['testId'] && changes['testId'].currentValue !== changes['testId'].previousValue) {
      if (this.testId) {
        this.loadTest(this.testId);
      }
    }
  }

  constructor(private fb: FormBuilder, private questionService: QuestionService, private answerService: AnswerService, private userService: UserService, private testService: TestService) {
    this.form = this.fb.group({
      testTitle: new FormControl(),
      testDescription: new FormControl(),
      creationDate: new FormControl(),
      lastChangeDate: new FormControl(),
    });
  }

  loadTest(testId: number): void {
    this.loading = true;
    this.testService.getTestById(testId).subscribe(
      (test: Test) => {
        this.form.patchValue({
          testTitle: test.testName,
          testDescription: test.testDescription,
          creationDate: test.creationDate,
          lastChangeDate: test.lastChangeDate
        });
        this.selectedQuestions = test.questions;
        this.creationDate = test.creationDate;
        console.log(this.selectedQuestions);
        this.loading = false;
      },
      error => {
        console.error('Error fetching test:', error);
      }
    );
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      this.userService.getUserById(1).subscribe(
        (user: User) => {
          const newTest: Test = {
            id: 0,
            testName: formData.testTitle,
            testDescription: formData.testDescription,
            creationDate: this.creationDate,
            lastChangeDate: new Date(),
            user: user,
            questions: this.selectedQuestions
          };

          // const now = new Date();
          // const isoString = now.toISOString();
          // const isoStringWithoutSeconds = isoString.substring(0, 16);
          // newTest.lastChangeDate = new Date(isoStringWithoutSeconds);

          this.testService.updateTest(this.testId, newTest).subscribe(
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

  onQuestionsSelected(selectedQuestions: Question[]): void {
    this.selectedQuestions = selectedQuestions;
  }

  removeQuestion(selectedQuestion: Question): void {
    const index = this.selectedQuestions.findIndex(q => q.id === selectedQuestion.id);
    if (index !== -1) {
      this.selectedQuestions.splice(index, 1);
    }
  }

  closeOverlay() {
    this.loadTest(this.testId);
    this.close.emit();
  }

  toggleQuestionSelection(question: Question): void {
    const index = this.selectedQuestions.findIndex(q => q.id === question.id);
    if (index == -1) {
      this.selectedQuestions.push(question);
    }
  }
}
