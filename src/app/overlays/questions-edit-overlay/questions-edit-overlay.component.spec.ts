import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuestionsEditOverlayComponent } from './questions-edit-overlay.component';

describe('QuestionsEditOverlayComponent', () => {
  let component: QuestionsEditOverlayComponent;
  let fixture: ComponentFixture<QuestionsEditOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuestionsEditOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuestionsEditOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
