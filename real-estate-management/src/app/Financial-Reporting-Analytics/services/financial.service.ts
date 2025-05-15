// src/app/services/financial.service.ts

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Mock service to simulate fetching financial data
@Injectable({
  providedIn: 'root'
})
export class FinancialService {

  constructor() { }

  // Simulate an API call to fetch financial data
  getIncomeAndExpenses(): Observable<any> {
    const mockData = {
      income: 5000,  // Example rent income
      expenses: 1500 // Example property expenses
    };
    return of(mockData); // Return as observable
  }
}
