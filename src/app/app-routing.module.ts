import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {MainPageComponent} from "./pages/main-page/main-page.component";
import {TestsessionStartComponent} from "./pages/testsession-start/testsession-start.component";
import {TestsessionQuestionsComponent} from "./pages/testsession-questions/testsession-questions.component";
import {AuthGuardService} from "./service/AuthGuardService";
import {TestsessionEndComponent} from "./pages/testsession-end/testsession-end.component";
import {TestsessionAccessDeniedComponent} from "./pages/testsession-access-denied/testsession-access-denied.component";
import {TestsessionErrorComponent} from "./pages/testsession-error/testsession-error.component";
import {AccessControlService} from "./service/AccessControlService";

const routes: Routes = [
  // { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: "login", component: LoginPageComponent},
  { path: "", component: MainPageComponent},
  { path: 'testsession/:testsessionId/start', component: TestsessionStartComponent, canActivate: [AccessControlService] },
  { path: 'testsession/:testsessionId/questions', component: TestsessionQuestionsComponent},
  { path: 'testsession/end', component: TestsessionEndComponent },
  { path: 'access-denied', component: TestsessionAccessDeniedComponent },
  { path: 'error', component: TestsessionErrorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
