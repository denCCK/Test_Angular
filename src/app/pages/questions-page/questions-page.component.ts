import {ChangeDetectionStrategy, Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from "@angular/core";
import {FormControl, FormGroup} from "@angular/forms";
import {Question} from "../../models/question";
import {QuestionService} from "../../service/QuestionService";
import {AnswerService} from "../../service/AnswerService";
import {Answer} from "../../models/answer";


@Component({
  selector: "questions-page",
  templateUrl: "./questions-page.component.html",
  styleUrl: "./questions-page.component.less",
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class QuestionsPageComponent {
  questions: Question[] = [];
  paginatedQuestions: Question[] = [];
  selectedQuestionId: number | null = null;
  isAddOverlayVisible = false;
  isEditOverlayVisible = false;

  items = ['Наименование', 'Сложность', 'Тип', 'Практ./Теор.', 'Дата создания', 'Дата последнего изменения'];
  form: FormGroup;
  length = 10;
  index = 0;
  totalPages = 0;

  constructor(private questionService: QuestionService, private answerService: AnswerService) {
    this.form = new FormGroup({
      filters: new FormControl([]),
      searchQuery: new FormControl()
    });
  }

  ngOnInit() {
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.getQuestions().subscribe(questions => {
      this.questions = questions;
      this.totalPages = Math.ceil(this.questions.length / this.length);
      this.paginateQuestions();
    });
  }

  paginateQuestions() {
    const start = (this.index) * this.length;
    const end = start + this.length;
    this.paginatedQuestions = this.questions.slice(start, end);
  }

  goToPage(index: number): void {
    this.index = index;
    this.paginateQuestions();
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
    this.paginatedQuestions = this.paginatedQuestions.filter(question => question.id !== id);

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

  searchQuestions() {
    const searchQuery = this.form.get('searchQuery')?.value.toLowerCase();
    if (searchQuery) {
      this.questions = this.questions.filter(question =>
        question.questionName.toLowerCase().includes(searchQuery)
      );
      this.paginateQuestions();
    } else {
      this.loadQuestions();
    }
  }

  getAnswerTypeName(answerType: string): string {
    switch (answerType) {
      case 'single':
        return 'Одиночный';
      case 'multiple':
        return 'Множественный';
      case 'match':
        return 'Соответствие';
      case 'open':
        return 'Открытый';
      default:
        return '';
    }
  }

  getQuestionTypeName(questionType: string): string {
    switch (questionType) {
      case 'practical':
        return 'Практический';
      case 'theoretical':
        return 'Теоретический';
      default:
        return '';
    }
  }

}
