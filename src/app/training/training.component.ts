import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-training',
  imports: [CommonModule],
  templateUrl: './training.component.html',
  styleUrl: './training.component.css'
})
export class TrainingComponent implements OnInit {
  trainings: any[] = [];  
  selectedTraining: any = {};  
  isModalVisible: boolean = false;  

  isLoading: boolean = true;
  errorMessage: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getAllTrainings();  
  }

  
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  // Fetch training programs from the API
  getAllTrainings(): void {
    const headers = this.getAuthHeaders();
    this.http.get('http://localhost:8006/api/v1/training/trainings', { headers }).subscribe(
      (res: any) => {
        this.trainings = res;  // Store the fetched training data
        this.isLoading = false;  // Set loading state to false
      },
      (error) => {
        this.errorMessage = 'Error fetching training data.';  // Handle error
        this.isLoading = false;  // Set loading state to false even in case of error
      }
    );
  }

  // Open modal with the selected training details
  openModal(training: any) {
    this.selectedTraining = training;  // Set the selected training for the modal
    this.isModalVisible = true;  // Show the modal
  }

  // Close the modal
  closeModal() {
    this.isModalVisible = false;  // Hide the modal
  }

  // Enroll in the selected training
  enroll(training: any) {
    alert(`Enrolled in ${training.title} training program!`);  // Dummy alert for enrollment
    // You can implement actual enrollment logic here
  }
}

