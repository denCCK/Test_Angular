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
  constructor(private fb: FormBuilder, private questionService: QuestionService, private answerService: AnswerService, private userService: UserService, private testService: TestService) {
    this.form = this.fb.group({
      testTitle: new FormControl(),
      testDescription: new FormControl(),
    });
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

          const now = new Date();
          const isoString = now.toISOString();
          const isoStringWithoutSeconds = isoString.substring(0, 16);
          newTest.creationDate = new Date(isoStringWithoutSeconds);
          newTest.lastChangeDate = new Date(isoStringWithoutSeconds);

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
