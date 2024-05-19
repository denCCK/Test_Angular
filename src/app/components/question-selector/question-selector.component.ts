import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Question} from "../../models/question";

@Component({
  selector: 'app-question-selector',
  templateUrl: './question-selector.component.html',
  styleUrl: './question-selector.component.css'
})
export class QuestionSelectorComponent {
  @Input() questions: Question[] = [];
  @Output() questionsSelected = new EventEmitter<Question[]>();

  selectedQuestions: Question[] = [];
  checked: boolean = false;

  toggleQuestionSelection(question: Question): void {
    console.log(this.selectedQuestions.toString())
    if (!this.selectedQuestions.includes(question)) {
      this.selectedQuestions.push(question);
    }
    this.questionsSelected.emit(this.selectedQuestions);

    // if (!this.selectedQuestions.includes(question)) {
    //   const index = this.selectedQuestions.findIndex(q => q.id === question.id);
    //   if (index !== -1) {
    //     this.selectedQuestions.splice(index, 1);
    //   }
    // }
    //this.questionsSelected.emit(this.selectedQuestions);
  }
}
