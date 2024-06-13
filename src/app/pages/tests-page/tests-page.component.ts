import {Component} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Test} from "../../models/test";
import {TestService} from "../../service/TestService";
import {Question} from "../../models/question";

@Component({
  selector: "tests-page",
  templateUrl: "./tests-page.component.html",
  styleUrl: "./tests-page.component.less"
})
export class TestsPageComponent {
  tests!: Test[];
  paginatedTests: Test[] = [];
  selectedTestId: number | null = null;
  isAddOverlayVisible = false;
  isEditOverlayVisible = false;
  isGenOverlayVisible = false;
  length = 10;
  index = 0;
  totalPages = 0;

  constructor(private testService: TestService) { }

  ngOnInit(): void {
    this.loadTests();
  }

  items = ['Наименование', 'Дата создания', 'Дата последнего изменения', 'Кол-во вопросов'];

  form = new FormGroup({
    filters: new FormControl([]),
    searchQuery: new FormControl()
  });

  paginateTests() {
    const start = (this.index) * this.length;
    const end = start + this.length;
    this.paginatedTests = this.tests.slice(start, end);
  }

  goToPage(index: number): void {
    this.index = index;
    this.paginateTests();
  }

  deleteTest(id: number) {
    this.testService.deleteTest(id).subscribe(() => {
      console.log('Test deleted successfully');
      this.loadTests();
    }, error => {
      console.error('Error deleting question:', error);
    });
  }

  loadTests() {
    this.testService.getAllTests().subscribe(tests => {
      this.tests = tests;
      this.totalPages = Math.ceil(this.tests.length / this.length);
      this.paginateTests();
    });
  }

  showAddOverlay() {
    this.isAddOverlayVisible = true;
  }

  showEditOverlay(testId: number) {
    this.isEditOverlayVisible = true;
    this.selectedTestId = testId;
  }

  hideAddOverlay() {
    this.isAddOverlayVisible = false;
    this.loadTests();
  }

  hideEditOverlay() {
    this.isEditOverlayVisible = false;
    this.loadTests();
  }

  showGenOverlay() {
    this.isGenOverlayVisible = true;
  }

  hideGenOverlay() {
    this.isGenOverlayVisible = false;
    this.loadTests();
  }

  searchTests() {
    const searchQuery = this.form.get('searchQuery')?.value.toLowerCase();
    if (searchQuery) {
      this.tests = this.tests.filter(test =>
        test.testName.toLowerCase().includes(searchQuery)
      );
      this.paginateTests();
    } else {
      this.loadTests();
    }
  }
}
