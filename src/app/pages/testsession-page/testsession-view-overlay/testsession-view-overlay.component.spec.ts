import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsessionViewOverlayComponent } from './testsession-view-overlay.component';

describe('TestsessionViewOverlayComponent', () => {
  let component: TestsessionViewOverlayComponent;
  let fixture: ComponentFixture<TestsessionViewOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsessionViewOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsessionViewOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
