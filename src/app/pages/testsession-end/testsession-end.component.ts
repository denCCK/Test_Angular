import { Component } from '@angular/core';
import {FormBuilder, FormControl} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {TestsessionService} from "../../service/TestsessionService";
import {TestsessionResultService} from "../../service/TestsessionResultService";
import {TestsessionQuestionResultService} from "../../service/TestsessionQuestionResultService";
import {TestsessionAnswerResultService} from "../../service/TestsessionAnswerResultService";
import {TestService} from "../../service/TestService";
import {AnswerService} from "../../service/AnswerService";

@Component({
  selector: 'app-testsession-end',
  templateUrl: './testsession-end.component.html',
  styleUrl: './testsession-end.component.css'
})
export class TestsessionEndComponent {
  name!: string;
  surname!: string;

  constructor(private route: ActivatedRoute,) {
    this.route.queryParams.subscribe(params => {
      this.name = params['name'];
      this.surname = params['surname'];
    });
  }
}
