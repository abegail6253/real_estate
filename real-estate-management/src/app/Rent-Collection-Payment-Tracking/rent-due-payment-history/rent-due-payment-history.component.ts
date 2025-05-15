import { Component, OnInit } from '@angular/core';
import { RentDuePaymentHistoryService } from '../services/rent-due-payment-history.service';

@Component({
  selector: 'app-rent-due-payment-history',
  templateUrl: './rent-due-payment-history.component.html',
  styleUrls: ['./rent-due-payment-history.component.css']
})
export class RentDuePaymentHistoryComponent implements OnInit {
  userId: string = '123';  // Example user ID, replace with dynamic data if needed
  rentDue: number = 0;
  paymentHistory: any[] = [];
  overdueAmount: number = 0;

  constructor(private rentDuePaymentHistoryService: RentDuePaymentHistoryService) {}

  ngOnInit(): void {
    this.loadRentDue();
    this.loadPaymentHistory();
    this.loadOverdueAmount();
  }

  // Fetch rent due
  loadRentDue(): void {
    this.rentDuePaymentHistoryService.getRentDue(this.userId).subscribe(
      (rentDue) => {
        this.rentDue = rentDue;
      },
      (error) => {
        console.error('Error fetching rent due:', error);
      }
    );
  }

  // Fetch payment history
  loadPaymentHistory(): void {
    this.rentDuePaymentHistoryService.getPaymentHistory(this.userId).subscribe(
      (history) => {
        this.paymentHistory = history;
      },
      (error) => {
        console.error('Error fetching payment history:', error);
      }
    );
  }

  // Fetch overdue amount
  loadOverdueAmount(): void {
    this.rentDuePaymentHistoryService.getOverdueAmount(this.userId).subscribe(
      (overdueAmount) => {
        this.overdueAmount = overdueAmount;
      },
      (error) => {
        console.error('Error fetching overdue amount:', error);
      }
    );
  }
}
