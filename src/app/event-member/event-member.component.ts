import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-event-member',
  imports: [CommonModule, ModalComponent],
  templateUrl: './event-member.component.html',
  styleUrls: ['./event-member.component.css']
})
export class EventMemberComponent implements OnInit {
  events:any[] = [
    // { 
    //   eventName: 'Horse Racing', 
    //   eventDate: new Date(), 
    //   eventLocation: 'Location 1', 
    //   eventDescription: 'An exciting horse racing event with top riders from around the city.', 
    //   image: 'assets/pages/ev1.jpg' 
    // },
    // Add more events here
  ];

  selectedEvent: any = {};
  isModalVisible: boolean = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllEvents();  // Fetch events on component initialization
  }

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  // Fetch events from API
  getAllEvents(): void {
    const headers = this.getAuthHeaders();
    this.http.get('http://localhost:8006/api/v1/event/get-event', { headers }).subscribe(
      (res: any) => {
        this.events = res;  // Store the fetched events in events array
      },
      (error) => {
        console.error('Error fetching events:', error);
      }
    );
  }

  // Open modal when clicking 'View Details'
  openModal(event: any) {
    this.selectedEvent = event;
    this.isModalVisible = true;  // Set visibility to true to open the modal
  }

  // Close modal
  closeModal() {
    this.isModalVisible = false;  // Set visibility to false to close the modal
  }
}
