// answer-item.component.ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-answer-item',
  template: `
    <div class="answer-group">
      <div class="answer-item">
        <label for="answer">Введите вариант ответа</label>
        <input id="answer" class="input" type="text" placeholder="Введите вариант ответа" />
        <div class="upload-group">
          <label for="fileUpload" class="upload-label">Выберите файлы или перетяните их сюда</label>
          <input id="fileUpload" class="file-upload" type="file" />
        </div>
      </div>
      <div class="answer-images"></div>
      <button tuiButton (click)="remove()">Удалить</button>
    </div>
  `,
  styles: [`
    /* Add your styles here */
  `]
})
export class AnswerItemComponent {
  @Output() removeItem = new EventEmitter<void>();

  remove() {
    this.removeItem.emit();
  }
}
