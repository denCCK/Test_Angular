import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {QuestionService} from "../../service/QuestionService";
import {AnswerService} from "../../service/AnswerService";
import {UserService} from "../../service/UserService";
import {Question} from "../../models/question";
import {User} from "../../models/user";
import {Answer} from "../../models/answer";
import {Test} from "../../models/test";
import {TestService} from "../../service/TestService";

@Component({
  selector: 'app-tests-add-overlay',
  templateUrl: './tests-add-overlay.component.html',
  styleUrl: './tests-add-overlay.component.css'
})
export class TestsAddOverlayComponent implements OnInit{
  form: FormGroup;
  questions!: Question[];
  currentStep: number = 0;
  steps = ['Название', 'Описание', 'Вопросы'];

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();
  selectedQuestions!: Question[];

  ngOnInit(): void {
    this.questionService.getQuestions().subscribe(
      (questions: Question[]) => {
        this.questions = questions;
      },
      error => {
        console.error('Error fetching questions:', error);
      }
    );
  }
  constructor(private fb: FormBuilder, private questionService: QuestionService, private userService: UserService, private testService: TestService) {
    this.form = this.fb.group({
      testTitle: new FormControl('Название'),
      testDescription: new FormControl('Описание'),
      questions: new FormControl(),
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
        return this.form.controls['questions'].valid;
      default:
        return true;
    }
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
            creationDate: new Date(),
            lastChangeDate: new Date(),
            user: user,
            questions: this.selectedQuestions
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
    this.close.emit();
  }
}
