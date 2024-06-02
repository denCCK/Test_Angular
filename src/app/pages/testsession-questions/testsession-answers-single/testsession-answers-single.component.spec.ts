import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsessionAnswersSingleComponent } from './testsession-answers-single.component';

describe('TestsessionAnswersSingleComponent', () => {
  let component: TestsessionAnswersSingleComponent;
  let fixture: ComponentFixture<TestsessionAnswersSingleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsessionAnswersSingleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsessionAnswersSingleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
