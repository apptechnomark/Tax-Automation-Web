import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QbohomeComponent } from './qbohome.component';

describe('QbohomeComponent', () => {
  let component: QbohomeComponent;
  let fixture: ComponentFixture<QbohomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QbohomeComponent]
    });
    fixture = TestBed.createComponent(QbohomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
