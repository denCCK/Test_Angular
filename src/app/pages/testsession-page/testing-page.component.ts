import {Component, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Question} from "../../models/question";
import {QuestionService} from "../../service/QuestionService";
import {AnswerService} from "../../service/AnswerService";
import {FormControl, FormGroup} from "@angular/forms";
import {Answer} from "../../models/answer";
import {TestsessionService} from "../../service/TestsessionService";
import {Testsession} from "../../models/testsession";
import {Test} from "../../models/test";
import {TestService} from "../../service/TestService";

@Component({
  selector: "testing-page",
  templateUrl: "./testing-page.component.html",
  styleUrl: "./testing-page.component.less"
})
export class TestingPageComponent implements OnInit, OnChanges {
  testsessions!: Testsession[];
  testsession!: Testsession;
  tests!: Test[];

  isAddOverlayVisible = false;
  isEditOverlayVisible = false;
  isViewOverlayVisible = false;

  getTestsessionStatus(testsession: Testsession): string {
    const now = new Date();
    const startDate = new Date(testsession.startDate);
    const endDate = new Date(testsession.endDate);

    if (now < startDate) {
      return 'Ожидается';
    } else if (now > endDate) {
      return 'Завершено';
    } else {
      return 'Активно';
    }
  }

  constructor(private testsessionService: TestsessionService, private testService: TestService) { }

  items = ['Наименование', 'Активно', 'Окончено', 'Ожидается'];

  form = new FormGroup({
    filters: new FormControl([]),
  });

  length = 64;

  index = 1;

  goToPage(index: number): void {
    this.index = index;
    console.info('New page:', index);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["testsessions"] && changes["testsessions"].currentValue) {
      this.testsessions = changes["testsessions"].currentValue;
    }
  }

  ngOnInit(): void {
    this.loadTestsession();
    this.loadTests();
  }

  loadTestsession() {
    this.testsessionService.getAllTestsessions().subscribe(testsessions => {
      this.testsessions = testsessions;
      console.log(testsessions);
    });
  }

  loadTests() {
    this.testService.getAllTests().subscribe(tests => {
      this.tests = tests;
    });
  }

  showAddOverlay() {
    this.isAddOverlayVisible = true;
  }

  showEditOverlay(testsession: Testsession, tests: Test[]) {
    this.isEditOverlayVisible = true;
    this.testsession = testsession;
    this.tests = tests;
  }

  showViewOverlay(testsession: Testsession) {
    this.isViewOverlayVisible = true;
    this.testsession = testsession;
    console.log(this.testsession);
  }

  hideAddOverlay() {
    this.isAddOverlayVisible = false;
    this.loadTestsession();
  }

  hideEditOverlay() {
    this.isEditOverlayVisible = false;
    this.loadTestsession();
  }

  hideViewOverlay() {
    this.isViewOverlayVisible = false;
  }

  deleteTestsession(id: number) {
    this.testsessionService.deleteTestsession(id).subscribe(() => {
      console.log('Testsession deleted successfully');
      this.loadTestsession();
    }, error => {
      console.error('Error deleting testsession:', error);
    });
  }
}
