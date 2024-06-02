import { Injectable } from '@angular/core';

declare global {
  interface Window {
    MathJax: any;
  }
}

@Injectable({
  providedIn: 'root'
})
export class MathJaxService {
  constructor() {
    this.loadMathJax();
  }

  private loadMathJax() {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/3.1.2/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);
  }

  renderMathJax() {
    if (window.MathJax) {
      window.MathJax.typeset();
    }
  }
}
