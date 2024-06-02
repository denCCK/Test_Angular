import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsessionAnswersMultipleComponent } from './testsession-answers-multiple.component';

describe('TestsessionAnswersMultipleComponent', () => {
  let component: TestsessionAnswersMultipleComponent;
  let fixture: ComponentFixture<TestsessionAnswersMultipleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsessionAnswersMultipleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsessionAnswersMultipleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
