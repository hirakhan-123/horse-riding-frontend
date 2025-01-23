import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StripeFactoryService, StripeInstance } from "ngx-stripe";
import { switchMap } from "rxjs";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  public stripe!: StripeInstance;
  public stripeAmount!: number;
  isLoading: boolean = false;

  pricingPlans = [
    {
      name: 'Trainer Provided Plan',
      price: 49,
      duration: 'month',
      features: [
        'Trainers provided for training sessions',
        'Access to premium slots',
        'Personalized training schedules',
        '24/7 Support'
      ]
    },
    {
      name: 'One Week Horse Booking',
      price: 69,
      duration: 'week',
      features: [
        '1 Horse booked for one time slot per week',
        'Access to basic time slots',
        'Standard Support'
      ]
    },
    {
      name: 'One Month Horse Booking',
      price: 99,
      duration: 'month',
      features: [
        '1 Horse booked for one time slot per month',
        'Access to basic time slots',
        'Standard Support'
      ]
    }
  ];

  constructor(
    private http: HttpClient,
    private stripeFactory: StripeFactoryService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.stripe = this.stripeFactory.create('pk_test_51QjbyJQI5UEscutgHYRqjfSFek5VfXVymdy7QtxvpYWvBLosjDNBA0Bz4xnCzEKJHZffAnVNgp8qosTMMYrao95O00FHqQbtvx');
    this.stripeAmount = 100;
  }

  // Method to get authentication headers
  getAuthHeaders(): HttpHeaders | null {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (token) {
      return headers.set('Authorization', `Bearer ${token}`);
    } else {
      alert("User is not authenticated. Please log in.");
      this.router.navigate(['/login']); // Redirect to login if no token
      return null; // Return null if no token
    }
  }

  checkout(plan: any) {
    this.isLoading = true;
  
    // Get auth token from localStorage
    const headers = this.getAuthHeaders();
    if (!headers) {
      this.isLoading = false;
      return;
    }
  
    const backendUrl = 'http://localhost:8006';
  
    const paymentData = {
      amount: plan.price * 100,  // Convert price to cents
      planName: plan.name,
      planDuration: plan.duration
    };
  
    // Make API request to create checkout session
    this.http.post<{ sessionId: string }>(`${backendUrl}/api/v1/payment/create-checkout-session`, paymentData, { headers })
      .subscribe(
        async (response) => { // Use async function to handle await
          console.log("Stripe Session Response:", response);
  
          if (response.sessionId) {
            console.log("Redirecting to Stripe with sessionId:", response.sessionId);
  
            try {
              // Attempt to redirect the user to Stripe Checkout using the session ID
              await this.stripe.redirectToCheckout({ sessionId: response.sessionId });
              // If the redirection is successful, user will be redirected to Stripe automatically
            } catch (error: any) { // Handle any error during the redirection
              console.error("Stripe Redirection Error:", error);
              alert("Error redirecting to Stripe: " + error.message);
            }
  
          } else {
            console.error("No sessionId received from backend.");
            alert("Payment initiation failed. Please try again later.");
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          console.error("Error creating checkout session:", error);
          alert("Payment initiation failed. Please try again later.");
        }
      );
  }
  
  
}

interface IStripeSession {
  id: string;
}
