// src/app/financial-reporting/financial-reporting.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FinancialService } from '../services/financial.service';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-financial-reporting',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './financial-reporting.component.html',
  styleUrls: ['./financial-reporting.component.css']
})
export class FinancialReportingComponent implements OnInit {

  income: number = 0;
  expenses: number = 0;
  profit: number = 0;

  constructor(private financialService: FinancialService) { }

  ngOnInit(): void {
    this.fetchFinancialData();
  }

  // Method to fetch income and expense data
  fetchFinancialData(): void {
    this.financialService.getIncomeAndExpenses().subscribe(data => {
      this.income = data.income;
      this.expenses = data.expenses;
      this.calculateProfit();
    });
  }

  // Method to calculate profit
  calculateProfit(): void {
    this.profit = this.income - this.expenses;
  }
}
