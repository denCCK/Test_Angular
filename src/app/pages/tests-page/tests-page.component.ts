import {Component} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Test} from "../../models/test";
import {TestService} from "../../service/TestService";

@Component({
  selector: "tests-page",
  templateUrl: "./tests-page.component.html",
  styleUrl: "./tests-page.component.less"
})
export class TestsPageComponent {
  tests!: Test[];
  selectedTestId: number | null = null;
  isAddOverlayVisible = false;
  isEditOverlayVisible = false;

  constructor(private testService: TestService) { }

  ngOnInit(): void {
    this.loadTets();
  }

  items = ['Наименование', 'Дата создания', 'Дата последнего изменения', 'Кол-во вопросов'];

  form = new FormGroup({
    filters: new FormControl([]),
  });

  length = 64;

  index = 1;

  goToPage(index: number): void {
    this.index = index;
    console.info('New page:', index);
  }

  deleteTest(id: number) {
    this.testService.deleteTest(id).subscribe(() => {
      console.log('Test deleted successfully');
      this.loadTets();
    }, error => {
      console.error('Error deleting question:', error);
    });
  }

  loadTets() {
    this.testService.getTests().subscribe(tests => {
      this.tests = tests;
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
    this.loadTets();
  }

  hideEditOverlay() {
    this.isEditOverlayVisible = false;
    this.loadTets();
  }
}
