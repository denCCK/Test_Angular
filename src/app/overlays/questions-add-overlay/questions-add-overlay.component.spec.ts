import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsAddOverlayComponent } from './questions-add-overlay.component';

describe('OverlayngComponent', () => {
  let component: QuestionsAddOverlayComponent;
  let fixture: ComponentFixture<QuestionsAddOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionsAddOverlayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuestionsAddOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
