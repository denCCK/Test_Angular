import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Test} from "../../../models/test";
import {TestService} from "../../../service/TestService";
import {TestsessionService} from "../../../service/TestsessionService";
import {Grade} from "../../../models/grade";
import {Testsession} from "../../../models/testsession";
import {GradeService} from "../../../service/GradeService";
import {TuiDay, TuiTime} from "@taiga-ui/cdk";

@Component({
  selector: 'app-testsession-edit-overlay',
  templateUrl: './testsession-edit-overlay.component.html',
  styleUrl: './testsession-edit-overlay.component.css'
})
export class TestsessionEditOverlayComponent implements OnChanges {
  form: FormGroup;

  @Input() isVisible: boolean = false;
  @Input() testsession!: Testsession;
  @Input() tests!: Test[];
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private testsessionService: TestsessionService, private gradeService: GradeService) {
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

  fromTuiTimeToDate(tuiTime: TuiTime): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), tuiTime.hours, tuiTime.minutes, tuiTime.seconds, tuiTime.ms);
  }

  fromDateToTuiTime(date: Date): TuiTime {
    const parsedDate = new Date(date);
    return new TuiTime(parsedDate.getHours(), parsedDate.getMinutes(), parsedDate.getSeconds(), parsedDate.getMilliseconds());
  }

  fromTuiDayAndTimeToDate(tuiDay: TuiDay, tuiTime: TuiTime): Date {
    return new Date(tuiDay.year, tuiDay.month, tuiDay.day, tuiTime.hours, tuiTime.minutes, tuiTime.seconds, tuiTime.ms);
  }

  fromDateToTuiDayAndTime(date: Date): [TuiDay, TuiTime] {
    const parsedDate = new Date(date);
    const tuiDay = new TuiDay(parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate());
    const tuiTime = new TuiTime(parsedDate.getHours(), parsedDate.getMinutes(), parsedDate.getSeconds(), parsedDate.getMilliseconds());
    return [tuiDay, tuiTime];
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

  loadTestsession() {
    console.log(this.testsession);
    let testsessionTime: TuiTime;
    if (this.testsession.testsessionTime) {
      this.form.patchValue( {
        testsessionName: this.testsession.testsessionName,
        testsessionDescription: this.testsession.testsessionDescription,
        startDate: this.fromDateToTuiDayAndTime(this.testsession.startDate),
        endDate: this.fromDateToTuiDayAndTime(this.testsession.endDate),
        test: this.testsession.testId,
        questionsCount: this.testsession.questionsCount,
        testsessionTime: this.fromDateToTuiTime(this.testsession.testsessionTime)
      })
    } else {
      this.form.patchValue( {
        testsessionName: this.testsession.testsessionName,
        testsessionDescription: this.testsession.testsessionDescription,
        startDate: this.fromDateToTuiDayAndTime(this.testsession.startDate),
        endDate: this.fromDateToTuiDayAndTime(this.testsession.endDate),
        test: this.testsession.testId,
        questionsCount: this.testsession.questionsCount,
        testsessionTime: this.testsession.testsessionTime
      })
    }

    this.gradeService.getGradesByTestsessionId(this.testsession.id).subscribe(grades => {
      grades.forEach(grad => {
        this.grades.push(this.fb.group({
          gradeName: grad.gradeName,
          gradeValue: grad.gradeValue,
          testsessionId: this.testsession.id
        }));
      })
    });

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
        this.testsession.creationDate,
        new Date(),
        formValue.questionsCount,
        this.fromTuiTimeToDate(formValue.testsessionTime)
      );

      console.log(newTestsession);

      this.testsessionService.updateTestsession(this.testsession.id, newTestsession).subscribe((testsession) => {
        console.log(testsession);
        const newGrades: Grade[] = formValue.grades.map((grade: any) => new Grade(
          0,
          grade.gradeName,
          grade.gradeValue,
          testsession.id
        ));

        this.gradeService.updateGradesByTestsessionId(testsession.id, newGrades).subscribe(() => {
          this.closeOverlay();
        });

      });
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['testsession'] && changes['testsession'].currentValue !== changes['testsession'].previousValue) {
      if (this.testsession) {
        this.loadTestsession();
      }
    }
  }

  closeOverlay(): void {
    this.form.patchValue( {
      testsessionName: '',
      testsessionDescription: '',
      startDate: '',
      endDate: '',
      test: '',
    })
    this.grades.clear();
    this.close.emit();
  }
}
