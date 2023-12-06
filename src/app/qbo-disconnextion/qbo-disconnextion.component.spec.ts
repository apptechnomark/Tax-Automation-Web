import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QboDisconnextionComponent } from './qbo-disconnextion.component';

describe('QboDisconnextionComponent', () => {
  let component: QboDisconnextionComponent;
  let fixture: ComponentFixture<QboDisconnextionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QboDisconnextionComponent]
    });
    fixture = TestBed.createComponent(QboDisconnextionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
