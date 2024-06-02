import { NgDompurifySanitizer } from "@tinkoff/ng-dompurify";
import {
    TuiRootModule,
    TuiDialogModule,
    TuiAlertModule,
    TUI_SANITIZER,
    TuiButtonModule,
    TuiLabelModule,
    TuiHostedDropdownModule,
    TuiSvgModule,
    TuiModeModule,
    TuiDataListModule,
    TuiTextfieldControllerModule,
    TUI_ICONS, TuiScrollbarModule, TuiHintModule, TuiLoaderModule, TuiErrorModule
} from "@taiga-ui/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {TuiAppBarModule} from "@taiga-ui/addon-mobile";
import {
  TuiComboBoxModule, TuiDataListWrapperModule,
  TuiFieldErrorPipeModule, TuiFilterByInputPipeModule,
  TuiFilterModule, TuiInputDateTimeModule,
  TuiInputModule, TuiInputNumberModule, TuiInputTimeModule,
  TuiPaginationModule,
  TuiProgressModule,
  TuiRadioLabeledModule, TuiStepperModule,
  TuiTabsModule, TuiTextareaModule
} from "@taiga-ui/kit";
import {TuiActiveZoneModule} from "@taiga-ui/cdk";
import {LoginPageComponent} from "./pages/login-page/login-page.component";
import {TestingPageComponent} from "./pages/testsession-page/testing-page.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MainPageComponent} from "./pages/main-page/main-page.component";
import {QuestionsPageComponent} from "./pages/questions-page/questions-page.component";
import {TestsPageComponent} from "./pages/tests-page/tests-page.component";
import { QuestionsAddOverlayComponent } from './overlays/questions-add-overlay/questions-add-overlay.component';
import {HttpClientModule} from "@angular/common/http";
import {TuiTableModule} from "@taiga-ui/addon-table";
import {AnswerItemComponent} from "./components/AnswerItemComponent";
import {MultipleChoiceComponent} from "./components/MulipleChoiceComponent";
import {MatchComponent} from "./components/MatchComponent";
import {OpenComponent} from "./components/OpenComponent";
import { QuestionsEditOverlayComponent } from './overlays/questions-edit-overlay/questions-edit-overlay.component';
import { TestsAddOverlayComponent } from './overlays/tests-add-overlay/tests-add-overlay.component';
import { TestsEditOverlayComponent } from './overlays/tests-edit-overlay/tests-edit-overlay.component';
import { QuestionSelectorComponent } from './components/question-selector/question-selector.component';
import {TuiDocNavigationModule} from "@taiga-ui/addon-doc";
import { TestsessionAddOverlayComponent } from './pages/testsession-page/testsession-add-overlay/testsession-add-overlay.component';
import { TestsessionEditOverlayComponent } from './pages/testsession-page/testsession-edit-overlay/testsession-edit-overlay.component';
import { TestsessionViewOverlayComponent } from './pages/testsession-page/testsession-view-overlay/testsession-view-overlay.component';
import {TuiAxesModule, TuiBarChartModule, TuiBarSetModule} from "@taiga-ui/addon-charts";
import { TestsessionStartComponent } from './pages/testsession-start/testsession-start.component';
import { TestsessionQuestionsComponent } from './pages/testsession-questions/testsession-questions.component';
import { TestsessionAnswersMatchComponent } from './pages/testsession-questions/testsession-answers-match/testsession-answers-match.component';
import { TestsessionAnswersOpenComponent } from './pages/testsession-questions/testsession-answers-open/testsession-answers-open.component';
import { TestsessionAnswersMultipleComponent } from './pages/testsession-questions/testsession-answers-multiple/testsession-answers-multiple.component';
import { TestsessionEndComponent } from './pages/testsession-end/testsession-end.component';
import { TestGenOverlayComponent } from './overlays/test-gen-overlay/test-gen-overlay.component';
import { TestsessionAccessDeniedComponent } from './pages/testsession-access-denied/testsession-access-denied.component';
import { TestsessionErrorComponent } from './pages/testsession-error/testsession-error.component';
import {BaseChartDirective} from "ng2-charts";
import {TuiMoneyModule} from "@taiga-ui/addon-commerce";
import {MathJaxPipe} from "./pipe/MathJaxPipe";
import {MathJaxService} from "./service/MathJaxService";
import {SingleChoiceComponent} from "./components/SingleChoiceComponent";
import { TestsessionAnswersSingleComponent } from './pages/testsession-questions/testsession-answers-single/testsession-answers-single.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    TestingPageComponent,
    QuestionsPageComponent,
    TestsPageComponent,
    MainPageComponent,
    AnswerItemComponent,
    MultipleChoiceComponent,
    MatchComponent,
    OpenComponent,
    SingleChoiceComponent,
    QuestionsAddOverlayComponent,
    QuestionsEditOverlayComponent,
    TestsAddOverlayComponent,
    TestsEditOverlayComponent,
    QuestionSelectorComponent,
    TestsEditOverlayComponent,
    TestsessionAddOverlayComponent,
    TestsessionEditOverlayComponent,
    TestsessionViewOverlayComponent,
    TestsessionStartComponent,
    TestsessionQuestionsComponent,
    TestsessionAnswersMatchComponent,
    TestsessionAnswersOpenComponent,
    TestsessionAnswersMultipleComponent,
    TestsessionAnswersSingleComponent,
    TestsessionEndComponent,
    TestGenOverlayComponent,
    TestsessionAccessDeniedComponent,
    TestsessionErrorComponent,
    MathJaxPipe,
    TestsessionAnswersSingleComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        TuiRootModule,
        TuiDialogModule,
        TuiTableModule,
        TuiAlertModule,
        TuiAppBarModule,
        TuiButtonModule,
        TuiLabelModule,
        TuiProgressModule,
        TuiTabsModule,
        TuiHostedDropdownModule,
        TuiSvgModule,
        TuiModeModule,
        TuiDataListModule,
        TuiActiveZoneModule,
        TuiInputModule,
        FormsModule,
        TuiFilterModule,
        ReactiveFormsModule,
        TuiTextfieldControllerModule,
        TuiPaginationModule,
        TuiRadioLabeledModule,
        TuiInputNumberModule,
        BrowserModule,
        HttpClientModule,
        TuiScrollbarModule,
        TuiTextareaModule,
        TuiDocNavigationModule,
        TuiStepperModule,
        TuiBarSetModule,
        TuiAxesModule,
        TuiBarChartModule,
        TuiHintModule,
        TuiLoaderModule,
        TuiErrorModule,
        TuiFieldErrorPipeModule,
        TuiInputDateTimeModule,
        TuiInputTimeModule,
        TuiComboBoxModule,
        TuiDataListWrapperModule,
        TuiFilterByInputPipeModule,
        BaseChartDirective,
        TuiMoneyModule
    ],
  providers: [MathJaxService],
  bootstrap: [AppComponent]
})
export class AppModule { }
