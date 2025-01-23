import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-success',
  imports: [CommonModule],
  template: `
    <div>
      <h1>Payment Success!</h1>
      <p *ngIf="paymentStatus">Status: {{ paymentStatus }}</p>
    </div>
  `,
})
export class StripeSuccessComponent implements OnInit {
  sessionId: string | null = null;
  paymentStatus: string | null = null;

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getHeaders() {
    const token = this.getAuthToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : '', // Attach token to Authorization header
    });
  }

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id');
    if (this.sessionId) {
      const headers = this.getHeaders();
      this.http
        .post(
          'http://localhost:8006/api/v1/payment/payment-success',
          { sessionId: this.sessionId },
          { headers }
        )
        .subscribe(
          (response: any) => {
            this.paymentStatus = 'Payment completed successfully!';
          },
          (error) => {
            this.paymentStatus = 'Payment confirmation failed.';
            console.error('Error confirming payment:', error);
          }
        );
    } else {
      this.paymentStatus = 'Session ID not found in URL.';
    }
  }
}
