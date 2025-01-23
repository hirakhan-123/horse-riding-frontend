import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-training-admin',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './training-admin.component.html',
  styleUrl: './training-admin.component.css'
})
export class TrainingAdminComponent {
  trainings: any[] = [];
  isEditing = false;
  editTrainingForm: FormGroup;
  currentTrainingId: string | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
    this.editTrainingForm = this.fb.group({
      title: ['', Validators.required],
      trainerNames: ['', Validators.required], // Will be converted to an array
      startDate: ['', Validators.required],
      durationInDays: [1, [Validators.required, Validators.min(1)]], // Added for session duration
      timeSlot: ['', Validators.required],
      capacity: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.getAllTrainings();
  }

  // Return headers with Authorization token if present
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getAllTrainings(): void {
    const headers = this.getAuthHeaders();

    this.http.get('http://localhost:8006/api/v1/training/trainings', { headers }).subscribe(
      (res: any) => {
        this.trainings = res;
      },
      (error) => {
        console.error('Error fetching trainings:', error);
      }
    );
  }

  editTraining(training: any): void {
    this.isEditing = true;
    this.currentTrainingId = training._id;

    // Populate form with selected training's data
    this.editTrainingForm.setValue({
      title: training.title || '',
      trainerNames: training.trainerNames?.join(', ') || '',
      startDate: training.startDate ? new Date(training.startDate).toISOString().substring(0, 10) : '',
      durationInDays: training.durationInDays || 1, // Ensure duration is set
      timeSlot: training.timeSlot || '',
      capacity: training.capacity || '',
    });
  }

  onEditSubmit(): void {
    if (this.editTrainingForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }

    if (this.currentTrainingId) {
      const headers = this.getAuthHeaders();
      const updatedData = { ...this.editTrainingForm.value };

      // Convert trainerNames from comma-separated string to an array
      updatedData.trainerNames = updatedData.trainerNames.split(',').map((name: string) => name.trim());

      this.http.patch(`http://localhost:8006/api/v1/training/update-training/${this.currentTrainingId}`, updatedData, { headers }).subscribe(
        (res: any) => {
          alert('Training updated successfully');
          this.getAllTrainings();
          this.isEditing = false; // Hide the edit form after successful update
        },
        (error) => {
          console.error('Error updating training:', error);
          alert('Failed to update training. Please try again.');
        }
      );
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  deleteTraining(trainingId: string): void {
      this.trainings = this.trainings.filter(training => training._id !== trainingId);
  
    if (confirm('Are you sure you want to delete this training?')) {
      const headers = this.getAuthHeaders();
  
      this.http.delete(`http://localhost:8006/api/v1/training/delete-training/${trainingId}`, { headers }).subscribe(
        (response: any) => {
          console.log('Delete response:', response);
          if (response.status === 'success') {
            alert('Training deleted successfully');
          } else {
            this.getAllTrainings();  
          }
        },
        (error) => {
            this.getAllTrainings();
        }
      );
    } else {
      this.getAllTrainings();
    }
  }
  
}
