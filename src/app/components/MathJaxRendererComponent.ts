import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import {MathJaxService} from "../service/MathJaxService";

@Component({
  selector: 'mathjax-renderer',
  template: `<span [id]="elementId"></span>`
})
export class MathJaxRendererComponent implements OnChanges {
  @Input() texExpression: string = '';

  elementId: string;

  constructor(private mathJaxService: MathJaxService) {
    this.elementId = 'mathjax-renderer-' + Math.floor(Math.random() * 10000);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.texExpression) {
      this.renderMath();
    }
  }

  private renderMath() {
    const element = document.getElementById(this.elementId);
    if (element) {
      element.textContent = this.texExpression;
      this.mathJaxService.renderMathJax();
    }
  }
}
