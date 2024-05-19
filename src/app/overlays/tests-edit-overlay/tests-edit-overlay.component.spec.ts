import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsEditOverlayComponent } from './tests-edit-overlay.component';

describe('TestsEditOverlayComponent', () => {
  let component: TestsEditOverlayComponent;
  let fixture: ComponentFixture<TestsEditOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsEditOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsEditOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
