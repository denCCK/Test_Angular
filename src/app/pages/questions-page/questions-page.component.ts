import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Question} from "../../models/question";
import {QuestionService} from "../../service/QuestionService";
import {AnswerService} from "../../service/AnswerService";
import {Answer} from "../../models/answer";


@Component({
  selector: "questions-page",
  templateUrl: "./questions-page.component.html",
  styleUrl: "./questions-page.component.less"
})

export class QuestionsPageComponent implements OnChanges{
  questions!: Question[];
  selectedQuestionId: number | null = null;
  isAddOverlayVisible = false;
  isEditOverlayVisible = false;

  constructor(private questionService: QuestionService, private answerService: AnswerService) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes["questions"] && changes["questions"].currentValue) {
      this.questions = changes["questions"].currentValue;
    }
  }


  ngOnInit(): void {
    this.loadQuestions();
  }

  loadQuestions() {
    //this.questions$ = this.questionService.getQuestions();
    this.questionService.getQuestions().subscribe(questions => {
      this.questions = questions;
    });
  }

  items = ['Наименование', 'Сложность', 'Тип', 'Практ./Теор.', 'Дата создания', 'Дата последнего изменения'];

  form = new FormGroup({
    filters: new FormControl([]),
  });

  length = 64;

  index = 1;

  goToPage(index: number): void {
    this.index = index;
    console.info('New page:', index);
  }

  showAddOverlay() {
    this.isAddOverlayVisible = true;
  }

  showEditOverlay(questionId: number) {
    this.isEditOverlayVisible = true;
    this.selectedQuestionId = questionId;
  }

  hideAddOverlay() {
    this.isAddOverlayVisible = false;
    this.loadQuestions();
  }

  hideEditOverlay() {
    this.isEditOverlayVisible = false;
    this.loadQuestions();
  }

  deleteQuestion(id: number): void {
    this.answerService.getAnswersByQuestionId(id).subscribe((oldAnswers: Answer[]) => {
      oldAnswers.forEach(answer => {
        this.answerService.deleteAnswer(answer.id).subscribe(() => {
          console.log('Old answer deleted successfully');

        }, error => {
          console.error('Error deleting old answer:', error);
        });
      });
      this.questionService.deleteQuestion(id).subscribe(() => {
        console.log('Question and related answers deleted successfully');
        this.loadQuestions();
      }, error => {
        console.error('Error deleting question:', error);
      });
    }, error => {
      console.error('Error getting old answers:', error);
    });
  }

}
