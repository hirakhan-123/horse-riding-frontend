import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-horses',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './all-horses.component.html',
  styleUrls: ['./all-horses.component.css'],
})
export class AllHorsesComponent implements OnInit {
  horses: any[] = [];
  isEditing = false;
  editHorseForm: FormGroup;
  currentHorseId: string | null = null;
  selectedImage: File | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
    this.editHorseForm = this.fb.group({
      name: ['', Validators.required],
      breed: ['', Validators.required],
      description: ['', Validators.required],
      slots: this.fb.array([]), // Initialize empty array
      image: [null], // Image is handled as a file upload
    });
  }

  ngOnInit(): void {
    this.getAllHorses();
  }

  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    console.log("Retrieved Token:", token);  // Debugging line
    let headers = new HttpHeaders();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    } else {
      console.warn("No token found in localStorage!");
    }
    return headers;
  }

  getAllHorses(): void {
    const headers = this.getAuthHeaders();
    this.http.get('http://localhost:8006/api/v1/horse/horses', { headers }).subscribe(
      (res: any) => {
        if (res.horse) {
          this.horses = res.horse; // Ensure response is properly formatted
        } else {
          console.error("Unexpected API response format:", res);
        }
      },
      (error) => {
        console.error('Error fetching horses:', error);
      }
    );
  }

  // Getter for slots FormArray
  get slots(): FormArray {
    return this.editHorseForm.get('slots') as FormArray;
  }

  createSlot(time: string, available: boolean) {
    return this.fb.group({
      time: [time, Validators.required],
      available: [available, Validators.required],
    });
  }

  editHorse(horse: any): void {
    this.isEditing = true;
    this.currentHorseId = horse._id;

    // Ensure exactly 3 slots exist with predefined times
    const fixedSlots = [
      { time: '9:00 AM', available: false },
      { time: '12:00 PM', available: false },
      { time: '4:00 PM', available: false },
    ];

    // Update slots based on horse data
    horse.slots?.forEach((slot: any) => {
      const match = fixedSlots.find(s => s.time === slot.time);
      if (match) {
        match.available = slot.available;
      }
    });

    // Reset and populate slots FormArray
    this.slots.clear();
    fixedSlots.forEach(slot => this.slots.push(this.createSlot(slot.time, slot.available)));

    // Set form values
    this.editHorseForm.patchValue({
      name: horse.name,
      breed: horse.breed,
      description: horse.description,
      image: '', // Clear image input field
    });
  }

  onImageChange(event: any) {
    this.selectedImage = event.target.files[0];
  }

  onEditSubmit(): void {
    if (this.editHorseForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }

    if (!this.currentHorseId) {
      alert('Invalid horse ID.');
      return;
    }

    const headers = this.getAuthHeaders();
    const formData = new FormData();

    formData.append('name', this.editHorseForm.value.name);
    formData.append('breed', this.editHorseForm.value.breed);
    formData.append('description', this.editHorseForm.value.description);
    formData.append('slots', JSON.stringify(this.editHorseForm.value.slots));

    if (this.selectedImage) {
      formData.append('image', this.selectedImage, this.selectedImage.name);
    }

    this.http.patch(
      `http://localhost:8006/api/v1/horse/update-horse/${this.currentHorseId}`,
      formData,
      { headers }
    ).subscribe(
      (res: any) => {
        alert('Horse updated successfully');
        this.getAllHorses();
        this.isEditing = false;
      },
      (error) => {
        console.error('Error updating horse:', error);
        alert('Failed to update horse. Please try again.');
      }
    );
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  deleteHorse(horseId: string): void {
    if (confirm('Are you sure you want to delete this horse?')) {
      const headers = this.getAuthHeaders();

      this.horses = this.horses.filter(horse => horse._id !== horseId);

      this.http.delete(`http://localhost:8006/api/v1/horse/delete-horse/${horseId}`, { headers }).subscribe(
        (response: any) => {
          if (response.status === 'success') {
            alert('Horse deleted successfully');
          } else {
            this.getAllHorses(); // Reload if delete fails
          }
        },
        (error) => {
          this.getAllHorses(); // Reload to restore data
        }
      );
    }
  }
}