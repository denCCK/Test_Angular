import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsessionAccessDeniedComponent } from './testsession-access-denied.component';

describe('TestsessionAccessDeniedComponent', () => {
  let component: TestsessionAccessDeniedComponent;
  let fixture: ComponentFixture<TestsessionAccessDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsessionAccessDeniedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsessionAccessDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
