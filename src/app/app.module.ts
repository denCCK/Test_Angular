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
    TUI_ICONS, TuiScrollbarModule
} from "@taiga-ui/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {TuiAppBarModule} from "@taiga-ui/addon-mobile";
import {
  TuiFilterModule,
  TuiInputModule, TuiInputNumberModule,
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
import { TestsessionAddOverlayComponent } from './overlays/testsession-add-overlay/testsession-add-overlay.component';
import { TestsessionEditOverlayComponent } from './overlays/testsession-edit-overlay/testsession-edit-overlay.component';
import { TestsessionViewOverlayComponent } from './overlays/testsession-view-overlay/testsession-view-overlay.component';

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
    QuestionsAddOverlayComponent,
    QuestionsEditOverlayComponent,
    TestsAddOverlayComponent,
    TestsEditOverlayComponent,
    QuestionSelectorComponent,
    TestsEditOverlayComponent,
    TestsessionAddOverlayComponent,
    TestsessionEditOverlayComponent,
    TestsessionViewOverlayComponent
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
    TuiStepperModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
