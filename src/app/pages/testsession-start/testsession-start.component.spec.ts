import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsessionStartComponent } from './testsession-start.component';

describe('TestsessionStartComponent', () => {
  let component: TestsessionStartComponent;
  let fixture: ComponentFixture<TestsessionStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsessionStartComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsessionStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
