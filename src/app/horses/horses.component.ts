import { CommonModule } from '@angular/common';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StripeFactoryService, StripeInstance } from 'ngx-stripe';
import { switchMap } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
interface IStripeSession {
  id: string;
}

@Component({
  selector: 'app-horses',
  imports: [CommonModule, RouterModule],
  templateUrl: './horses.component.html',
  styleUrls: ['./horses.component.css'],
})
export class HorsesComponent implements OnInit {
  public stripe!: StripeInstance;
  public stripeAmount!: number;
  isLoading: boolean = false;
  horses: any[] = [];
  selectedSlot: any = null;
  elements: any;
  cardElement: any;
  selectedHorse: any = {};

  constructor(
    private http: HttpClient,
    private stripeFactory: StripeFactoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchHorses();
    this.stripe = this.stripeFactory.create(
      'pk_test_51QjbyJQI5UEscutgHYRqjfSFek5VfXVymdy7QtxvpYWvBLosjDNBA0Bz4xnCzEKJHZffAnVNgp8qosTMMYrao95O00FHqQbtvx'
    );
    this.stripeAmount = 100;
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getHeaders() {
    const token = this.getAuthToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '',
    });
  }

  fetchHorses() {
    this.isLoading = true;
    this.http
      .get<any>('http://localhost:8006/api/v1/horse/horses', {
        headers: this.getHeaders(),
      })
      .subscribe(
        (res) => {
          console.log('Fetched horses:', res);
          this.horses = res.horse || [];
          this.isLoading = false;
        },
        (error) => {
          console.log('Error fetching horses:', error);
          this.isLoading = false;
        }
      );
  }
  selectSlot(horse: any, slot: any): void {
    this.selectedHorse = horse;
    if (!this.selectedSlot) this.selectedSlot = {};
    this.selectedSlot.horseId = horse._id;
    this.selectedSlot.price = horse.price;
    this.selectedSlot.time = slot.time;

    console.log(`Selected Slot for ${horse.name}: ${slot.time}`);
    console.log('Selected Slot Price:', this.selectedSlot.price);
  }

  checkout() {
    console.log('Selected Slot for', this.selectedSlot);

    if (!this.selectedSlot?.horseId || !this.selectedSlot?.time) {
      console.error('Horse or Slot not selected.');
      return;
    }

    const requestData = {
      horseId: this.selectedSlot.horseId,
      slotTime: this.selectedSlot.time,
      amount: this.selectedSlot.price * 100, // Convert to cents for Stripe
    };

    console.log('Sending payment request:', requestData);

    this.isLoading = true;

    this.http
      .post<{ sessionId: string; url: string }>(
        'http://localhost:8006/api/v1/payment/create-checkout-session',
        requestData,
        { headers: this.getHeaders(), observe: 'response' }
      )
      .subscribe({
        next: (response) => {
          const session = response.body;
          if (!session?.sessionId) {
            console.error('No session ID received from server.');
            this.isLoading = false;
            return;
          }

          // Redirect to Stripe Checkout
          this.stripe
            .redirectToCheckout({ sessionId: session.sessionId })
            .subscribe({
              next: () => {
                console.log('Stripe Checkout redirection successful.');
              },
              error: (err) => {
                console.error('Stripe Checkout Error:', err.message || err);
                this.isLoading = false;
              },
            });
        },
        error: (err) => {
          console.error('Error creating checkout session:', err.message || err);
          this.isLoading = false;
        },
      });
  }

  confirmPayment(token: string) {
    console.log('Proceeding with payment using token:', token);
  }
}
