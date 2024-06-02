import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsessionQuestionsComponent } from './testsession-questions.component';

describe('TestsessionQuestionsComponent', () => {
  let component: TestsessionQuestionsComponent;
  let fixture: ComponentFixture<TestsessionQuestionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsessionQuestionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsessionQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
