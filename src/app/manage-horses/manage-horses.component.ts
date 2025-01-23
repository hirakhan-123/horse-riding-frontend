import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-manage-horses',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './manage-horses.component.html',
  styleUrls: ['./manage-horses.component.css']
})
export class ManageHorsesComponent implements OnInit {
  addHorseForm: FormGroup;
  showAlert: boolean = false;
  alertType: string = '';
  alertMessage: string = '';
  selectedImage: File | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.addHorseForm = this.fb.group({
      name: ['', Validators.required],
      breed: ['', Validators.required],
      description: ['', Validators.required],
      price:['',Validators.required],
      // Initialize FormArray with 3 slots
      slots: this.fb.array([
        this.createSlot(),
        this.createSlot(),
        this.createSlot()
      ], Validators.required),
      image: [null, Validators.required],
    });
  }

  ngOnInit(): void {}

  // Getter for slots
  get slots() {
    return this.addHorseForm.get('slots') as FormArray;
  }

  // Create a slot form group
  createSlot() {
    return this.fb.group({
      time: ['', Validators.required],
      available: [true, Validators.required]  // Default availability to true
    });
  }

 // Method to handle image selection
onImageChange(event: any): void {
  this.selectedImage = event.target.files[0]; // Get the first selected file
  this.addHorseForm.get('image')?.setValue(this.selectedImage); // Set the selected image in form control
}

// Submit the form
onSubmit(): void {
  if (this.addHorseForm.invalid) {
    this.alertMessage = 'Please fill out all fields correctly.';
    this.alertType = 'error';
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), 3000);
    return;
  }

  const slots = this.addHorseForm.value.slots;

  // Validate that time is one of the allowed values
  const validTimes = ['9:00 AM', '12:00 PM', '4:00 PM'];
  for (let i = 0; i < slots.length; i++) {
    if (!validTimes.includes(slots[i].time)) {
      this.alertMessage = `Slot ${i + 1} time must be one of ${validTimes.join(', ')}.`;
      this.alertType = 'error';
      this.showAlert = true;
      setTimeout(() => (this.showAlert = false), 3000);
      return;
    }
  }

  // Continue with form submission after validation
  const token = localStorage.getItem('authToken');
  if (!token) {
    this.alertMessage = 'No authentication token found.';
    this.alertType = 'error';
    this.showAlert = true;
    setTimeout(() => (this.showAlert = false), 3000);
    return;
  }

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  const horseData = { ...this.addHorseForm.value };
  const formData = new FormData();
  formData.append('name', horseData.name);
  formData.append('breed', horseData.breed);
  formData.append('description', horseData.description);
  formData.append('price', horseData.price);
  formData.append('slots', JSON.stringify(horseData.slots));

  // Append image if selected
  if (this.selectedImage) {
    formData.append('image', this.selectedImage, this.selectedImage.name);
  }

  // Make the HTTP request
  this.http.post('http://localhost:8006/api/v1/horse/create-horse', formData, { headers }).subscribe(
    (res: any) => {
      this.alertMessage = 'Horse added successfully!';
      this.alertType = 'success';
      this.showAlert = true;
      setTimeout(() => this.router.navigateByUrl('/admin-dashboard/all-horses'), 3000);
    },
    (error: any) => {
      this.alertMessage = error.error?.message || 'An error occurred. Please try again.';
      this.alertType = 'error';
      this.showAlert = true;
    }
  );
}

  
  
}