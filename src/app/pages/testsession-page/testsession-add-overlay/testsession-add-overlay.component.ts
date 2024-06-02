import {Component, EventEmitter, Input, OnChanges, OnInit, Output, signal, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {QuestionService} from "../../../service/QuestionService";
import {AnswerService} from "../../../service/AnswerService";
import {UserService} from "../../../service/UserService";
import {Test} from "../../../models/test";
import {TestsessionService} from "../../../service/TestsessionService";
import {TestService} from "../../../service/TestService";
import {Testsession} from "../../../models/testsession";
import {Grade} from "../../../models/grade";
import {Answer} from "../../../models/answer";
import {GradeService} from "../../../service/GradeService";
import {TuiDay, TuiTime} from "@taiga-ui/cdk";

@Component({
  selector: 'app-testsession-add-overlay',
  templateUrl: './testsession-add-overlay.component.html',
  styleUrl: './testsession-add-overlay.component.css'
})
export class TestsessionAddOverlayComponent implements OnInit, OnChanges {

  form: FormGroup;
  questionType!: string;
  tests!: Test[];
  testId = 0;
  totalPoints = 0;

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private testService: TestService, private testsessionService: TestsessionService, private gradeService: GradeService) {
    this.form = this.fb.group({
      testsessionName: new FormControl(),
      testsessionDescription: new FormControl(),
      startDate: new FormControl(),
      endDate: new FormControl(),
      test: new FormControl(),
      grades: this.fb.array([]),
      questionsCount: new FormControl(),
      testsessionTime: new FormControl()
    });
  }

  calculateTotalPoints(): void {
    this.totalPoints = 0;
    this.testService.getTestById(this.form.value.test).subscribe(test => {
      test.questions.forEach(question => {
        this.totalPoints += question.questionPoint;
      });
      console.log(this.totalPoints);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['test'] && changes['test'].currentValue !== changes['test'].previousValue) {
      console.log(this.testId);
    }
  }

  fromTuiTimeToDate(tuiTime: TuiTime): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), tuiTime.hours, tuiTime.minutes, tuiTime.seconds, tuiTime.ms);
  }

  fromTuiDayAndTimeToDate(tuiDay: TuiDay, tuiTime: TuiTime): Date {
    return new Date(tuiDay.year, tuiDay.month, tuiDay.day, tuiTime.hours, tuiTime.minutes, tuiTime.seconds, tuiTime.ms);
  }

  get grades(): FormArray {
    return this.form.get('grades') as FormArray;
  }

  addGrade(): void {
    this.grades.push(this.fb.group({
      gradeName: new FormControl(),
      gradeValue: new FormControl(),
      testsessionId: new FormControl()
    }));
  }

  removeGrade(index: number): void {
    this.grades.removeAt(index);
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;

      const newTestsession = new Testsession(
        0,
        formValue.testsessionName,
        formValue.testsessionDescription,
        this.fromTuiDayAndTimeToDate(formValue.startDate[0], formValue.startDate[1]),
        this.fromTuiDayAndTimeToDate(formValue.endDate[0], formValue.endDate[1]),
        formValue.test,
        new Date(),
        new Date(),
        formValue.questionsCount,
        this.fromTuiTimeToDate(formValue.testsessionTime)
      );

      console.log(newTestsession);

      this.testsessionService.createTestsession(newTestsession).subscribe((testsession) => {
        const grades: Grade[] = formValue.grades.map((grade: any) => new Grade(
          0,
          grade.gradeName,
          grade.gradeValue,
          testsession.id
        ));
        grades.forEach(grade => {
          this.gradeService.createGrade(grade).subscribe(() => {

          });
        });

        this.closeOverlay();
      });
    }
  }

  ngOnInit(): void {
    this.loadTests();
  }

  loadTests(): void {
    this.testService.getAllTests().subscribe(tests => {
      this.tests = tests;
    });
  }

  closeOverlay(): void {
    this.close.emit();
  }

}
