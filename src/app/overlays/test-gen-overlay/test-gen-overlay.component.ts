import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Question} from "../../models/question";
import {QuestionService} from "../../service/QuestionService";
import {User} from "../../models/user";
import {Test} from "../../models/test";
import {UserService} from "../../service/UserService";
import {TestService} from "../../service/TestService";

@Component({
  selector: 'app-test-gen-overlay',
  templateUrl: './test-gen-overlay.component.html',
  styleUrl: './test-gen-overlay.component.css'
})
export class TestGenOverlayComponent implements OnInit {
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  form: FormGroup;

  errorMessage: string = '';
  averageDifficulty!: number;
  requiredTheoryCount!: number;
  requiredPracticalCount!: number;


  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  difficultyValues = Array.from({ length: 5 }, (_, i) => i + 1);
  percentageValues = Array.from({ length: 11 }, (_, i) => i * 10);

  constructor(
    private questionService: QuestionService,
    private fb: FormBuilder,
    private userService: UserService,
    private testService: TestService
  ) {
    this.form = this.fb.group({
      testTitle: new FormControl(),
      testDescription: new FormControl(),
      minDifficulty: [1],
      maxDifficulty: [5],
      theoryPercentage: [50],
      theme: [''],
      questionCount: [10]
    });
  }

  ngOnInit(): void {
    this.questionService.getQuestions().subscribe(questions => {
      this.questions = questions;
      //this.filterQuestions();
    });

    // this.form.valueChanges.subscribe(() => {
    //   this.filterQuestions();
    // });
  }



  filterQuestions() {
    const { minDifficulty, maxDifficulty, theoryPercentage, theme, questionCount } = this.form.value;

    let selectedQuestions = this.questions;

    if (theme) {
      selectedQuestions = selectedQuestions.filter(q => q.theme === theme);
    }

    // selectedQuestions = selectedQuestions.filter(q =>
    //   q.difficulty >= minDifficulty && q.difficulty <= maxDifficulty
    // );

    const theoryQuestions = selectedQuestions.filter(q => q.questionType == "theoretical");
    const practicalQuestions = selectedQuestions.filter(q => q.questionType == "practical");

    this.requiredTheoryCount = Math.round(questionCount * (theoryPercentage / 100));
    this.requiredPracticalCount = questionCount - this.requiredTheoryCount;

    let selectedTheoryQuestions = theoryQuestions.slice(0, this.requiredTheoryCount);
    let selectedPracticalQuestions = practicalQuestions.slice(0, this.requiredPracticalCount);

    let combinedQuestions = [...selectedTheoryQuestions, ...selectedPracticalQuestions];

    this.averageDifficulty = this.calculateAverageDifficulty(combinedQuestions);

    if (combinedQuestions.length < questionCount || this.averageDifficulty < minDifficulty || this.averageDifficulty > maxDifficulty) {
      this.errorMessage = 'Недостаточно вопросов для выбора с заданными параметрами или средняя сложность не попадает в заданный диапазон';
      this.filteredQuestions = [];
    } else {
      this.errorMessage = '';
      this.filteredQuestions = combinedQuestions;
    }
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

}
