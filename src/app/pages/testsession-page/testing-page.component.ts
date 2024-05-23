import {Component, OnChanges, OnInit, SimpleChanges} from "@angular/core";
import {Question} from "../../models/question";
import {QuestionService} from "../../service/QuestionService";
import {AnswerService} from "../../service/AnswerService";
import {FormControl, FormGroup} from "@angular/forms";
import {Answer} from "../../models/answer";
import {TestsessionService} from "../../service/TestsessionService";
import {Testsession} from "../../models/testsession";

@Component({
  selector: "testing-page",
  templateUrl: "./testing-page.component.html",
  styleUrl: "./testing-page.component.less"
})
export class TestingPageComponent implements OnInit, OnChanges {
  testsessions!: Testsession[];
  selectedTestsessionId: number | null = null;
  isAddOverlayVisible = false;
  isEditOverlayVisible = false;
  isViewOverlayVisible = false;

  constructor(private testsessionService: TestsessionService) { }

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
  }

  loadTestsession() {
    this.testsessionService.getAllTestsessions().subscribe(testsession => {
      this.testsessions = testsession;
    });
  }

  showAddOverlay() {
    this.isAddOverlayVisible = true;
  }

  showEditOverlay(testsessionId: number) {
    this.isEditOverlayVisible = true;
    this.selectedTestsessionId = testsessionId;
  }

  showViewOverlay(testsessionId: number) {
    this.isViewOverlayVisible = true;
    this.selectedTestsessionId = testsessionId;
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
