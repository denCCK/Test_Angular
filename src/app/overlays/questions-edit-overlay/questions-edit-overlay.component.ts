import {Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {QuestionService} from "../../service/QuestionService";
import {UserService} from "../../service/UserService";
import {AnswerService} from "../../service/AnswerService";
import {Question} from "../../models/question";
import {User} from "../../models/user";
import {Answer} from "../../models/answer";
import {Subject} from "rxjs";

@Component({
  selector: 'app-questions-edit-overlay',
  templateUrl: './questions-edit-overlay.component.html',
  styleUrls: ['./questions-edit-overlay.component.css']
})
export class QuestionsEditOverlayComponent implements OnInit, OnChanges {
  form: FormGroup;
  questionType!: string;
  answers!: Answer[];
  creationDate!: Date;
  currentStep: number = 0;
  steps = ['Название', 'Постановка', 'Баллы', 'Сложность', 'Тип', 'Практ./Теор.', 'Тема', 'Ответы'];

  @Input() isVisible: boolean = false;
  @Input() questionId: number | null = null;
  @Output() close = new EventEmitter<void>();

  constructor(private fb: FormBuilder, private questionService: QuestionService, private answerService: AnswerService, private userService: UserService) {
    this.form = this.fb.group({
      questionTitle: new FormControl(),
      questionDescription: new FormControl(),
      questionPoints: new FormControl(),
      difficulty: new FormControl(),
      answersType: new FormControl(),
      questionType: new FormControl(),
      theme: new FormControl()
    });
    if (this.questionId != null) {

    }
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
        return this.form.controls['difficulty'].valid;
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

  ngOnInit(): void {
    console.log(this.questionId)
    if (this.questionId) {
      this.loadQuestion(this.questionId);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questionId'] && changes['questionId'].currentValue !== changes['questionId'].previousValue) {
      if (this.questionId) {
        this.loadQuestion(this.questionId);
      }
    }
  }

  loadQuestion(questionId: number): void {
    this.questionService.getQuestionById(questionId).subscribe((question: Question) => {
      this.form.patchValue({
        questionTitle: question.questionName,
        questionDescription: question.questionDescription,
        questionPoints: question.questionPoint,
        difficulty: `${question.difficulty}`,
        answersType: question.answersType,
        questionType: question.questionType,
        creationDate: question.creationDate,
        theme: question.theme
      });
      this.answerService.getAnswersByQuestionId(questionId).subscribe(
        (answers: Answer[]) => {
          this.answers = answers;
          console.log(answers);
        },
        error => {
          console.error('Error fetching answers:', error);
        }
      );
      this.creationDate = question.creationDate;
      this.onQuestionTypeChange({ target: { value: question.answersType } });
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
            creationDate: this.creationDate,
            lastChangeDate: new Date(),
            questionPoint: formData.questionPoints,
            questionType: formData.questionType,
            answersType: formData.answersType,
            difficulty: formData.difficulty,
            user: user,
            theme: formData.theme
          };
          const now = new Date();
          const isoString = now.toISOString();
          const isoStringWithoutSeconds = isoString.substring(0, 16);
          newQuestion.lastChangeDate = new Date(isoStringWithoutSeconds);

          if (this.questionId != null) {
            this.questionService.updateQuestion(this.questionId, newQuestion).subscribe(
              (questionResponse: Question) => {
                console.log('Question created successfully:', questionResponse);

                this.answerService.getAnswersByQuestionId(questionResponse.id).subscribe((oldAnswers: Answer[]) => {
                  oldAnswers.forEach(answer => {
                    this.answerService.deleteAnswer(answer.id).subscribe(() => {
                      console.log('Old answer deleted successfully');
                    });
                  });
                });

                const answers: Answer[] = this.extractAnswersFromFormData(formData, questionResponse);
                console.log(answers);
                answers.forEach(answer => {
                  this.answerService.createAnswer(answer).subscribe(
                    (answerResponse: Answer) => {
                      console.log('Answer created successfully:', answerResponse);
                      this.close.emit();
                    });
                });
                this.answers = answers;

              });
          }

        });

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

  onQuestionTypeChange(event: any): void {
    this.questionType = event.target.value;
  }

  onAnswersFormChange(formGroup: FormGroup) {
    this.form.setControl('answers', formGroup);
  }

  closeOverlay(): void {
    this.close.emit();
  }
}

