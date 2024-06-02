import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-testsession-start',
  templateUrl: './testsession-start.component.html',
  styleUrl: './testsession-start.component.less'
})
export class TestsessionStartComponent {
  name: string = '';
  surname: string = '';
  testsessionId: number;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.testsessionId = this.route.snapshot.params['testsessionId'];
  }

  startTest() {
    if (this.name && this.surname) {
      this.router.navigate([`/testsession/${this.testsessionId}/questions`], {
        queryParams: { name: this.name, surname: this.surname }
      });
    }
  }
}
