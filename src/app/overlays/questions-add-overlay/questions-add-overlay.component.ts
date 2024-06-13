import {Component, EventEmitter, Input, Output} from '@angular/core';
import {OverlayService} from "../../overlay.service";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
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
  currentStep: number = 0;
  steps = ['Название', 'Постановка', 'Баллы', 'Сложность', 'Тип', 'Практ./Теор.', 'Тема', 'Ответы'];


  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private questionService: QuestionService, private answerService: AnswerService, private userService: UserService) {
    this.form = this.fb.group({
      questionTitle: new FormControl('Вопрос'),
      questionDescription: new FormControl('Постановка'),
      questionPoints: new FormControl(1),
      complexity: new FormControl('1'),
      answersType: new FormControl('single'),
      questionType: new FormControl('theoretical'),
      answers: new FormControl(),
      theme: new FormControl('Тема')
    });
    this.onQuestionTypeChange({ target: { value: this.form.value.answersType } });
  }

  canNavigateToStep(step: number): boolean {
    if (step <= this.currentStep) {
      return true;
    }
    return false;
  }

  setStep(index: number): void {
    this.currentStep = index;
  }

  prevStep(): void {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }

  nextStep(): void {
    if (this.currentStep < 7 && this.isStepValid(this.currentStep)) {
      this.currentStep++;
    }
  }

  isStepValid(step: number): boolean {
    switch (step) {
      case 0:
        return this.form.controls['questionTitle'].valid;
      case 1:
        return this.form.controls['questionDescription'].valid;
      case 2:
        return this.form.controls['questionPoints'].valid;
      case 3:
        return this.form.controls['complexity'].valid;
      case 4:
        return this.form.controls['answersType'].valid;
      case 5:
        return this.form.controls['questionType'].valid;
      case 6:
        return this.form.controls['theme'].valid;
      case 7:
        return this.form.controls['answers'].valid;
      default:
        return false;
    }
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
            user: user,
            theme: formData.theme
          };

          const now = new Date();
          const isoString = now.toISOString();
          const isoStringWithoutSeconds = isoString.substring(0, 16);
          newQuestion.creationDate = new Date(isoStringWithoutSeconds);
          newQuestion.lastChangeDate = new Date(isoStringWithoutSeconds);

          this.questionService.createQuestion(newQuestion).subscribe(
            (questionResponse: Question) => {
              const answers: Answer[] = this.extractAnswersFromFormData(formData, questionResponse);
              let i = 0;
              answers.forEach(answer => {
                this.answerService.createAnswer(answer).subscribe(
                  (answerResponse: Answer) => {
                    if (i == answers.length) this.close.emit();
                  },
                  error => {
                  }
                );
                i++;
              });

              //this.close.emit();

            },
            error => {
              console.error('Error creating question:', error);
            }
          );

          //this.close.emit();
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
          isFormula: answerData.isFormula,
          complianceText: answerData.matchText,
          complianceImg: answerData.matchImage,
          isComplianceFormula: answerData.isComplianceFormula,
          question: question,
          answerFormula: answerData.answerFormula
        };
        answers.push(answer);
      }
    } else if (formData.answers.choices != null) {
      for (let i = 0; i < formData.answers.choices.length; i++) {
        const answerData = formData.answers.choices[i];
        if (question.answersType == 'single') {
          if (formData.answers.selectedChoice == i) {
            answerData.isCorrect = true;
          } else {
            answerData.isCorrect = false;
          }
        }
        const answer: Answer = {
          id: 0,
          answerText: answerData.text,
          answerImg: answerData.image,
          isCorrect: answerData.isCorrect,
          isFormula: answerData.isFormula,
          complianceText: answerData.matchText,
          complianceImg: answerData.matchImage,
          isComplianceFormula: answerData.isComplianceFormula,
          question: question,
          answerFormula: answerData.answerFormula
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
        isFormula: answerData.isFormula,
        complianceText: answerData.matchText,
        complianceImg: answerData.matchImage,
        isComplianceFormula: answerData.isComplianceFormula,
        question: question,
        answerFormula: answerData.answerFormula
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
