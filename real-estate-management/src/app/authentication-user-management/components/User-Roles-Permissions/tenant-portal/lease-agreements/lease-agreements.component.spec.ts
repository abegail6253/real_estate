import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseAgreementsComponent } from './lease-agreements.component';

describe('LeaseAgreementsComponent', () => {
  let component: LeaseAgreementsComponent;
  let fixture: ComponentFixture<LeaseAgreementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaseAgreementsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaseAgreementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
