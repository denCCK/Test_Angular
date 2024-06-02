import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import {MathJaxService} from "../service/MathJaxService";

@Pipe({
  name: 'mathjax',
  pure: false
})
export class MathJaxPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer, private mathJaxService: MathJaxService) {}

  transform(value: string): SafeHtml {
    this.mathJaxService.renderMathJax();
    return this.sanitizer.bypassSecurityTrustHtml(`\\(${value}\\)`);
  }
}
