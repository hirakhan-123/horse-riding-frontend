import { CommonModule } from '@angular/common';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { StripeFactoryService, StripeInstance } from "ngx-stripe";
import { loadStripe } from '@stripe/stripe-js';
import { switchMap } from "rxjs";

interface IStripeSession {
  id: string;
}

@Component({
  selector: 'app-horses',
  imports: [CommonModule],
  templateUrl: './horses.component.html',
  styleUrls: ['./horses.component.css']
})
export class HorsesComponent implements OnInit{
  public stripe!: StripeInstance;
  public stripeAmount!: number;
  isLoading: boolean = false;
  horses: any[] = [];  
  selectedSlot: any = null;
  elements: any;  
  cardElement: any; 
  selectedHorse: any = {};  

  constructor(private http: HttpClient, private stripeFactory: StripeFactoryService) {}

  ngOnInit(): void {
    this.fetchHorses();
    this.stripe = this.stripeFactory.create('pk_test_51QjbyJQI5UEscutgHYRqjfSFek5VfXVymdy7QtxvpYWvBLosjDNBA0Bz4xnCzEKJHZffAnVNgp8qosTMMYrao95O00FHqQbtvx');
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
    this.http.get<any>('http://localhost:8006/api/v1/horse/horses', { headers: this.getHeaders() }).subscribe(
      (res) => {
        console.log("Fetched horses:", res);
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
    console.log("Selected Slot Price:", this.selectedSlot.price);
}


checkout() {
  console.log("Selected Slot for", this.selectedSlot);
  if (!this.selectedSlot.horseId || !this.selectedSlot.time) {
      console.error("Horse or Slot not selected.");
      return;
  }
  
  const requestData = {
      horseId: this.selectedSlot.horseId,
      slotTime: this.selectedSlot.time,
      amount: this.selectedSlot.price * 100,  // Convert to cents for Stripe
  };

  console.log("Sending payment request:", requestData); // Debugging log

  this.isLoading = true;
  
  this.http.post('http://localhost:8006/api/v1/payment/create-checkout-session', 
  requestData, { headers: this.getHeaders(), observe: 'response' })
  .pipe(
      switchMap((response: HttpResponse<Object>) => {
          const session: IStripeSession = response.body as IStripeSession;
          return this.stripe.redirectToCheckout({ sessionId: session.id });
      })
  )
  .subscribe(result => {
      if (result.error) {
          console.log(result.error);
      }
  });
}

  confirmPayment(token: string) {
    console.log('Proceeding with payment using token:', token);
  }
}
