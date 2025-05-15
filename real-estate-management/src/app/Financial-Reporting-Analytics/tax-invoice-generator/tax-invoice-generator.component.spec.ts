import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxInvoiceGeneratorComponent } from './tax-invoice-generator.component';

describe('TaxInvoiceGeneratorComponent', () => {
  let component: TaxInvoiceGeneratorComponent;
  let fixture: ComponentFixture<TaxInvoiceGeneratorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxInvoiceGeneratorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TaxInvoiceGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
