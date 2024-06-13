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
  paginatedTestsessions: Testsession[] = [];
  length = 10;
  index = 0;
  totalPages = 0;

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
    searchQuery: new FormControl()
  });

  paginateTestsessions() {
    const start = (this.index) * this.length;
    const end = start + this.length;
    this.paginatedTestsessions = this.testsessions.slice(start, end);
  }

  goToPage(index: number): void {
    this.index = index;
    this.paginateTestsessions();
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
      this.totalPages = Math.ceil(this.testsessions.length / this.length);
      this.paginateTestsessions();
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

  searchTestsessions() {
    const searchQuery = this.form.get('searchQuery')?.value.toLowerCase();
    if (searchQuery) {
      this.testsessions = this.testsessions.filter(testsession =>
        testsession.testsessionName.toLowerCase().includes(searchQuery)
      );
      this.paginateTestsessions();
    } else {
      this.loadTestsession();
    }
  }
}
