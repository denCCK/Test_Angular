import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsessionAnswersOpenComponent } from './testsession-answers-open.component';

describe('TestsessionAnswersOpenComponent', () => {
  let component: TestsessionAnswersOpenComponent;
  let fixture: ComponentFixture<TestsessionAnswersOpenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsessionAnswersOpenComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsessionAnswersOpenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
