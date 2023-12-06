import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyNotConnectPageComponent } from './company-not-connect-page.component';

describe('CompanyNotConnectPageComponent', () => {
  let component: CompanyNotConnectPageComponent;
  let fixture: ComponentFixture<CompanyNotConnectPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyNotConnectPageComponent]
    });
    fixture = TestBed.createComponent(CompanyNotConnectPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
