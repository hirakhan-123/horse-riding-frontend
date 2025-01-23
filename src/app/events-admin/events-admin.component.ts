import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events-admin',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './events-admin.component.html',
  styleUrls: ['./events-admin.component.css']
})
export class EventsAdminComponent {
  eventForm: FormGroup;
  alertMessage: string = '';
  alertType: string = '';
  showAlert: boolean = false;
  events: any[] = [];
  selectedEvent: any = null;
  selectedImage: File | null = null;
  selectedImagePreview: string | null = null;

  constructor(private http: HttpClient) {
    this.eventForm = new FormGroup({
      eventName: new FormControl('', Validators.required),
      eventDate: new FormControl('', Validators.required),
      eventDescription: new FormControl('', Validators.required),
      eventStartTime: new FormControl('', Validators.required),
      eventLocation: new FormControl('', Validators.required),
      image: new FormControl(null, Validators.required)
    });
  }

  getAuthToken(): string | null {
    return localStorage.getItem('authToken');
  }

  getHeaders() {
    const token = this.getAuthToken();
    return new HttpHeaders({
      Authorization: token ? `Bearer ${token}` : ''
    });
  }

  onImageSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.selectedImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.selectedImage = null;
      this.selectedImagePreview = null;
    }
  }

  addEvent() {
    if (this.eventForm.invalid || !this.selectedImage) {
      this.showAlertMessage('Please fill out all fields correctly, and add an image.', 'error');
      return;
    }

    const formData = new FormData();
    this.appendFormData(formData);

    this.http.post('http://localhost:8006/api/v1/event/create-event', formData, { headers: this.getHeaders() })
      .subscribe(
        (response: any) => {
          this.showAlertMessage('Event added successfully!', 'success');
          this.resetForm();
          this.fetchEvents();
        },
        (error) => this.handleError(error)
      );
  }

  updateEvent() {
    if (this.eventForm.invalid) {
      this.showAlertMessage('Please fill out all fields correctly.', 'error');
      return;
    }

    const formData = new FormData();
    this.appendFormData(formData);

    this.http.patch(`http://localhost:8006/api/v1/event/update-event/${this.selectedEvent._id}`, formData, { headers: this.getHeaders() })
      .subscribe(
        (response: any) => {
          this.showAlertMessage('Event updated successfully!', 'success');
          this.resetForm();
          this.fetchEvents();
        },
        (error) => this.handleError(error)
      );
  }

  appendFormData(formData: FormData) {
    formData.append('eventName', this.eventForm.get('eventName')?.value);
    formData.append('eventDate', this.eventForm.get('eventDate')?.value);
    formData.append('eventDescription', this.eventForm.get('eventDescription')?.value);
    formData.append('eventStartTime', this.eventForm.get('eventStartTime')?.value);
    formData.append('eventLocation', this.eventForm.get('eventLocation')?.value);
    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }
  }

  fetchEvents() {
    this.http.get<any[]>('http://localhost:8006/api/v1/event/get-event', { headers: this.getHeaders() })
      .subscribe(
        (events) => { this.events = events; },
        (error) => console.error('Error fetching events:', error)
      );
  }

  editEvent(event: any) {
    this.selectedEvent = event;
    this.eventForm.patchValue({
      eventName: event.eventName,
      eventDate: event.eventDate ? event.eventDate.split('T')[0] : '',
      eventDescription: event.eventDescription,
      eventLocation: event.eventLocation,
      eventStartTime: this.formatTime(event.eventStartTime)
    });
    this.selectedImagePreview = 'http://localhost:8006' + event.image;
  }

  resetForm() {
    this.eventForm.reset();
    this.selectedImage = null;
    this.selectedImagePreview = null;
    this.selectedEvent = null;
  }

  showAlertMessage(message: string, type: string) {
    this.alertMessage = message;
    this.alertType = type;
    this.showAlert = true;
    setTimeout(() => this.showAlert = false, 3000);
  }

  handleError(error: any) {
    console.error('Error:', error);
    this.showAlertMessage(error.error?.message || 'An error occurred. Please try again.', 'error');
  }

  formatTime(time12h: string): string {
    if (!time12h) return '';
    const match = time12h.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)$/i);
    if (!match) return time12h;
    let [_, hours, minutes, period] = match;
    let hours24 = parseInt(hours, 10);
    if (period.toUpperCase() === 'PM' && hours24 !== 12) hours24 += 12;
    else if (period.toUpperCase() === 'AM' && hours24 === 12) hours24 = 0;
    return `${hours24.toString().padStart(2, '0')}:${minutes}`;
  }

  ngOnInit() {
    this.fetchEvents();
  }
}
