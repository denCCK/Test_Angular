import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {TestingPageComponent} from "./pages/testsession-page/testing-page.component";
import {MainPageComponent} from "./pages/main-page/main-page.component";
import {QuestionsPageComponent} from "./pages/questions-page/questions-page.component";
import {TestsPageComponent} from "./pages/tests-page/tests-page.component";

const routes: Routes = [
  { path: "", component: LoginPageComponent},
  { path: "users", component: TestingPageComponent},
  { path: "main", component: MainPageComponent},
  { path: "tests", component: TestsPageComponent},
  { path: "questions", component: QuestionsPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
