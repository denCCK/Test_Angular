import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestsessionEndComponent } from './testsession-end.component';

describe('TestsessionEndComponent', () => {
  let component: TestsessionEndComponent;
  let fixture: ComponentFixture<TestsessionEndComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestsessionEndComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TestsessionEndComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
