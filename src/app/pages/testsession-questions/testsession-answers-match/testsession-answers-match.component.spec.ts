import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsessionAnswersMatchComponent } from './testsession-answers-match.component';

describe('TestsessionAnswersMatchComponent', () => {
  let component: TestsessionAnswersMatchComponent;
  let fixture: ComponentFixture<TestsessionAnswersMatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsessionAnswersMatchComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsessionAnswersMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
