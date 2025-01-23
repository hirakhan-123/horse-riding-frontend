import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-booking',
  imports: [CommonModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  bookings: any[] = [];
  horseBookings: any[] = [];
  trainingBookings: any[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getBookings();
  }

  getBookings() {
    this.loading = true;
    this.error = null;
    
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:8006/api/v1/booking/all-bookings', { headers })
      .subscribe(
        (response) => {
          this.bookings = response;
          this.horseBookings = this.bookings.filter(booking => booking.horse);
          this.trainingBookings = this.bookings.filter(booking => booking.training);
          this.loading = false;
        },
        (error) => {
          this.error = 'Error fetching bookings';
          this.loading = false;
        }
      );
  }

  updateBookingStatus(bookingId: string, status: string) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.patch(
      'http://localhost:8006/api/v1/booking/update-booking-status', 
      { bookingId, status },
      { headers }
    )
      .subscribe(
        (response) => {
          alert('Booking status updated successfully!');
          this.getBookings(); // Refresh the list of bookings
        },
        (error) => {
          alert('Error updating booking status');
        }
      );
  }

  cancelBooking(bookingId: string) {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(
      'http://localhost:8006/api/v1/booking/cancel-booking', 
      { body: { bookingId }, headers }
    )
      .subscribe(
        (response) => {
          alert('Booking cancelled successfully!');
          this.getBookings(); // Refresh the list of bookings
        },
        (error) => {
          alert('Error cancelling booking');
        }
      );
  }
}
