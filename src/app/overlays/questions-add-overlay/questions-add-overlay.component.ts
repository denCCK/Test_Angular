import {Component, EventEmitter, Input, Output} from '@angular/core';
import {OverlayService} from "../../overlay.service";
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Question} from "../../models/question";
import {QuestionService} from "../../service/QuestionService";
import {Answer} from "../../models/answer";
import {AnswerService} from "../../service/AnswerService";
import {UserService} from "../../service/UserService";
import {User} from "../../models/user";

@Component({
  selector: 'questions-add-overlay',
  templateUrl: './questions-add-overlay.component.html',
  styleUrl: './questions-add-overlay.component.less'
})
export class QuestionsAddOverlayComponent {
  form: FormGroup;
  questionType!: string;
  answers: number[] = [];

  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private questionService: QuestionService, private answerService: AnswerService, private userService: UserService) {
    this.form = this.fb.group({
      questionTitle: new FormControl(),
      questionDescription: new FormControl(),
      questionPoints: new FormControl(),
      complexity: new FormControl(),
      answersType: new FormControl(),
      questionType: new FormControl(),
      answers: new FormControl()
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formData = this.form.value;
      this.userService.getUserById(1).subscribe(
        (user: User) => {
          const newQuestion: Question = {
            id: 0,
            questionName: formData.questionTitle,
            questionDescription: formData.questionDescription,
            creationDate: new Date(),
            lastChangeDate: new Date(),
            questionPoint: formData.questionPoints,
            questionType: formData.questionType,
            answersType: formData.answersType,
            difficulty: formData.complexity,
            user: user
          };

          const now = new Date();
          const isoString = now.toISOString();
          const isoStringWithoutSeconds = isoString.substring(0, 16);
          newQuestion.creationDate = new Date(isoStringWithoutSeconds);
          newQuestion.lastChangeDate = new Date(isoStringWithoutSeconds);

          this.questionService.createQuestion(newQuestion).subscribe(
            (questionResponse: Question) => {
              console.log('Question created successfully:', questionResponse);
              const answers: Answer[] = this.extractAnswersFromFormData(formData, questionResponse);
              answers.forEach(answer => {
                console.log(answer.answerText);
                console.log(answer.answerImg);
                console.log(answer.isCorrect);
                console.log(answer.complianceText);
                console.log(answer.complianceImg);
                console.log(answer.question);
                this.answerService.createAnswer(answer).subscribe(
                  (answerResponse: Answer) => {
                    console.log('Answer created successfully:', answerResponse);
                    this.close.emit();
                  },
                  error => {
                    console.error('Error creating answer:', error);
                  }
                );
              });



            },
            error => {
              console.error('Error creating question:', error);
            }
          );

          this.close.emit();
        },
        error => {
          console.error('Error fetching user:', error);
        }
      );
    }
  }

  extractAnswersFromFormData(formData: any, question: Question): Answer[] {
    const answers: Answer[] = [];

    if (formData.answers.matches != null) {
      for (let i = 0; i < formData.answers.matches.length; i++) {
        const answerData = formData.answers.matches[i];
        const answer: Answer = {
          id: 0,
          answerText: answerData.text,
          answerImg: answerData.image,
          isCorrect: answerData.isCorrect,
          complianceText: answerData.matchText,
          complianceImg: answerData.matchImage,
          question: question
        };
        answers.push(answer);
      }
    } else if (formData.answers.choices != null) {
      for (let i = 0; i < formData.answers.choices.length; i++) {
        const answerData = formData.answers.choices[i];
        const answer: Answer = {
          id: 0,
          answerText: answerData.text,
          answerImg: answerData.image,
          isCorrect: answerData.isCorrect,
          complianceText: answerData.matchText,
          complianceImg: answerData.matchImage,
          question: question
        };
        answers.push(answer);
      }
    } else if (formData.answers.text != null) {
      const answerData = formData.answers.text;
      const answer: Answer = {
        id: 0,
        answerText: formData.answers.text,
        answerImg: answerData.image,
        isCorrect: answerData.isCorrect,
        complianceText: answerData.matchText,
        complianceImg: answerData.matchImage,
        question: question
      };
      answers.push(answer);
    }


    return answers;
  }

  onQuestionTypeChange(event: any) {
    this.questionType = event.target.value;
  }

  onAnswersFormChange(formGroup: FormGroup) {
    this.form.setControl('answers', formGroup);
  }

  closeOverlay(): void {
    this.close.emit();
  }
}
