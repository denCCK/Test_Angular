import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsessionErrorComponent } from './testsession-error.component';

describe('TestsessionErrorComponent', () => {
  let component: TestsessionErrorComponent;
  let fixture: ComponentFixture<TestsessionErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsessionErrorComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsessionErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
