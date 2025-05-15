import { Component } from '@angular/core';

@Component({
  selector: 'app-tax-invoice-generator',
  template: `
    <div class="tax-invoice-generator">
      <h2>Tax & Invoice Generator</h2>
      
      <div>
        <button (click)="generateTaxReport()">Generate Tax Report</button>
        <p>{{ generateTaxReport() }}</p>
      </div>
      
      <div>
        <button (click)="generateInvoice()">Generate Invoice</button>
        <p>{{ invoiceDetails }}</p>
      </div>

      <div>
        <button (click)="generateFinancialSummary()">Generate Financial Summary</button>
        <p>{{ generateFinancialSummary() }}</p>
      </div>
    </div>
  `,
  styles: [`
    .tax-invoice-generator {
      padding: 20px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .tax-invoice-generator h2 {
      text-align: center;
      color: #333;
    }

    .tax-invoice-generator div {
      margin-bottom: 15px;
    }

    .tax-invoice-generator button {
      padding: 10px 20px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }

    .tax-invoice-generator button:hover {
      background-color: #45a049;
    }

    .tax-invoice-generator p {
      font-size: 16px;
      color: #333;
    }
  `],
  standalone: true
})
export class TaxInvoiceGeneratorComponent {

  // Example data
  propertyIncome: number = 5000;  // Monthly income
  propertyExpenses: number = 1500; // Monthly expenses
  taxRate: number = 0.15;  // Example tax rate (15%)
  invoiceDetails: string = '';  // To store generated invoice details

  // Method to generate a tax report
  generateTaxReport(): string {
    const taxAmount = this.propertyIncome * this.taxRate;
    return `Tax Report:\nIncome: ${this.propertyIncome}\nExpenses: ${this.propertyExpenses}\nTax Due: ${taxAmount}`;
  }

  // Method to generate an invoice
  generateInvoice(): void {
    const totalAmount = this.propertyIncome - this.propertyExpenses;
    this.invoiceDetails = `Invoice:\nProperty Income: ${this.propertyIncome}\nExpenses: ${this.propertyExpenses}\nTotal Due: ${totalAmount}`;
  }

  // Method to generate a financial summary
  generateFinancialSummary(): string {
    const totalAmount = this.propertyIncome - this.propertyExpenses;
    return `Financial Summary:\nIncome: ${this.propertyIncome}\nExpenses: ${this.propertyExpenses}\nProfit: ${totalAmount}`;
  }

}
