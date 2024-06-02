import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Question} from "../../models/question";

@Component({
  selector: 'app-question-selector',
  templateUrl: './question-selector.component.html',
  styleUrl: './question-selector.component.css'
})
export class QuestionSelectorComponent implements OnInit, OnChanges {
  @Input() questions: Question[] = [];
  @Input() selectedQuestions: Question[] = [];
  @Output() questionsSelected = new EventEmitter<Question[]>();

  currentSelectedQuestions: Question[] = [];
  checked: boolean = false;

  ngOnInit():void {
    if (this.selectedQuestions) {
      this.currentSelectedQuestions = this.selectedQuestions;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedQuestions'] && changes['selectedQuestions'].currentValue !== changes['selectedQuestions'].previousValue) {
      if (this.selectedQuestions) {
        this.currentSelectedQuestions = this.selectedQuestions;
        console.log(this.currentSelectedQuestions);
      }
    }
  }

  toggleQuestionSelection(question: Question): void {

    if (!this.currentSelectedQuestions.includes(question)) {
      this.currentSelectedQuestions.push(question);
    }
    this.questionsSelected.emit(this.currentSelectedQuestions);

  }
}
