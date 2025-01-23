import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-new-training',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-new-training.component.html',
  styleUrls: ['./add-new-training.component.css'],
})
export class AddNewTrainingComponent {
  alertMessage: string = '';
  alertType: string = '';
  showAlert: boolean = false;

  addTrainingForm: FormGroup = new FormGroup({
    title: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    durationInDays: new FormControl('', [Validators.required, Validators.min(1)]),
    sessionDurationInHours: new FormControl('', [Validators.required, Validators.min(1)]),
    price: new FormControl(null, [Validators.required, Validators.min(1)]),
    trainerNames: new FormControl([], Validators.required),
    startDate: new FormControl('', Validators.required),
    timeSlot: new FormControl('', Validators.required),
  });

  constructor(private http: HttpClient) {}

  router = inject(Router);

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn("No token found in localStorage!");
    }
    return headers;
  }

  onSubmit() {
    if (this.addTrainingForm.invalid) {
      this.alertMessage = 'Please fill out all fields correctly.';
      this.alertType = 'error';
      this.showAlert = true;
      setTimeout(() => (this.showAlert = false), 3000);
      return;
    }

    // Get Authorization Headers
    const headers = this.getAuthHeaders();

    // Make the HTTP POST request to the backend API for adding new training
    this.http.post('http://localhost:8006/api/v1/training/create-training', this.addTrainingForm.value, { headers }).subscribe(
      (res: any) => {
        // On success, show a message and navigate to another page after 3 seconds
        this.alertMessage = 'Training added successfully!';
        this.alertType = 'success';
        this.showAlert = true;
        
        // Reset form fields after successful submission
        this.addTrainingForm.reset();
        
        setTimeout(() => {
          this.showAlert = false;
          this.router.navigateByUrl('/all-trainings');
        }, 3000);
      },
      (error: any) => {
        // On error, show the error message
        this.alertMessage = error.error?.message || 'An error occurred. Please try again.';
        this.alertType = 'error';
        this.showAlert = true;
        setTimeout(() => (this.showAlert = false), 3000);
      }
    );
  }
}
