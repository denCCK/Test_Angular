import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsessionEditOverlayComponent } from './testsession-edit-overlay.component';

describe('TestsessionEditOverlayComponent', () => {
  let component: TestsessionEditOverlayComponent;
  let fixture: ComponentFixture<TestsessionEditOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsessionEditOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsessionEditOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
