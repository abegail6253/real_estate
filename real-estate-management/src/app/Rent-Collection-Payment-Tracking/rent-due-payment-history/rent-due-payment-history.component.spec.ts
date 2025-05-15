import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentDuePaymentHistoryComponent } from './rent-due-payment-history.component';

describe('RentDuePaymentHistoryComponent', () => {
  let component: RentDuePaymentHistoryComponent;
  let fixture: ComponentFixture<RentDuePaymentHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentDuePaymentHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentDuePaymentHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
