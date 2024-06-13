import {AfterViewInit, Component, inject, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {TestingPageComponent} from "../testsession-page/testing-page.component";
import {tuiIsString} from "@taiga-ui/cdk";
import {QuestionsPageComponent} from "../questions-page/questions-page.component";
import {TestsPageComponent} from "../tests-page/tests-page.component";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less']
})
export class MainPageComponent implements AfterViewInit {
  @ViewChild('dynamic', {read: ViewContainerRef})
  dynamic!: ViewContainerRef;
  form: FormGroup;

  constructor() {
    this.form = new FormGroup({
    });
  }

  ngAfterViewInit() {
    this.dynamic.clear();
    this.dynamic.createComponent(QuestionsPageComponent);
  }

  readonly tabs = [
    'Вопросы',
    'Наборы вопросов',
    'Тестирование'
  ];
  activeElement = String(this.tabs[0]);
  get activeItemIndex(): number {
    return this.tabs.indexOf(this.activeElement);
  }
  stop(event: Event): void {
    event.stopPropagation();
  }
  isString(tab: unknown): tab is string {
    return tuiIsString(tab);
  }
  onClick(activeElement: string) {
    this.activeElement = activeElement;
    if (activeElement === 'Вопросы') {
      this.dynamic.clear();
      this.dynamic.createComponent(QuestionsPageComponent);
    } else if (activeElement === 'Наборы вопросов') {
      this.dynamic.clear();
      this.dynamic.createComponent(TestsPageComponent);
    } else if (activeElement === 'Тестирование') {
      this.dynamic.clear();
      this.dynamic.createComponent(TestingPageComponent);
    }
  }
}




