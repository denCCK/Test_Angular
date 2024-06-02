import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsessionAddOverlayComponent } from './testsession-add-overlay.component';

describe('TestsessionAddOverlayComponent', () => {
  let component: TestsessionAddOverlayComponent;
  let fixture: ComponentFixture<TestsessionAddOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsessionAddOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsessionAddOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
