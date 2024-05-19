import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsAddOverlayComponent } from './tests-add-overlay.component';

describe('TestsAddOverlayComponent', () => {
  let component: TestsAddOverlayComponent;
  let fixture: ComponentFixture<TestsAddOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsAddOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsAddOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
