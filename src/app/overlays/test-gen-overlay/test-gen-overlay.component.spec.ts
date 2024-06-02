import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestGenOverlayComponent } from './test-gen-overlay.component';

describe('TestGenOverlayComponent', () => {
  let component: TestGenOverlayComponent;
  let fixture: ComponentFixture<TestGenOverlayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestGenOverlayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestGenOverlayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
