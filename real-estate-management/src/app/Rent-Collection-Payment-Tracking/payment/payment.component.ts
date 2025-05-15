// payment.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  stripe: Stripe | null = null;
  elements: StripeElements | null = null;
  cardElement: any;
  amount: number = 1000;  // Example: Rent amount (in cents for Stripe)

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // Load Stripe
    loadStripe('your-stripe-public-key').then((stripe) => {
      if (stripe) {
        this.stripe = stripe;
        this.elements = stripe.elements();  // Initialize elements only after stripe is loaded
        if (this.elements) {
          // Create the card element
          this.cardElement = this.elements.create('card');
          const cardElementContainer = document.getElementById('card-element');
          if (cardElementContainer) {
            this.cardElement.mount(cardElementContainer);  // Mount the card element to the DOM
          }
        }
      }
    });
  }

  // Handle Stripe payment
  handleStripePayment(): void {
    if (!this.stripe || !this.cardElement) {
      return;  // Ensure Stripe and cardElement are loaded before proceeding
    }

    // Create payment intent via your backend
    this.http.post('/api/payment/stripe', { amount: this.amount })
      .subscribe((paymentIntent: any) => {
        const { client_secret } = paymentIntent;

        // Use the Stripe.js client secret to confirm the payment
        this.stripe?.confirmCardPayment(client_secret, {
          payment_method: {
            card: this.cardElement,
          },
        }).then((result: any) => {
          if (result.error) {
            alert('Payment failed: ' + result.error.message);
          } else {
            alert('Payment successful!');
          }
        });
      });
  }

  // Handle PayPal payment
  handlePaypalPayment(): void {
    // Redirect to PayPal
    this.http.post('/api/payment/paypal', { amount: this.amount })
      .subscribe((response: any) => {
        window.location.href = response?.approval_url ?? ''; // Use optional chaining and nullish coalescing to handle potential null
      });
  }
}
