import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-add-new-users',
  imports: [ReactiveFormsModule, FormsModule, CommonModule],
  templateUrl: './add-new-users.component.html',
  styleUrls: ['./add-new-users.component.css'],
})
export class AddNewUsersComponent {
  alertMessage: string = '';
  alertType: string = '';
  showAlert: boolean = false;
  formId: string = '1';

  addUserForm: FormGroup = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\d{10,15}$/)]),
    role: new FormControl('admin', Validators.required),
  });

  constructor(private http: HttpClient) {}

  router = inject(Router);

  onSubmit() {
    if (this.addUserForm.invalid) {
      this.alertMessage = 'Please fill out all fields correctly.';
      this.alertType = 'error';
      this.showAlert = true;
      setTimeout(() => (this.showAlert = false), 3000);
      return;
    }
  
    // Make the HTTP POST request to the backend API for sign-up
    this.http.post('http://localhost:8006/api/v1/auth/signup', this.addUserForm.value).subscribe(
      (res: any) => {
        // On success, show a message and navigate to another page after 3 seconds
        this.alertMessage = 'An email has been sent to your account. Please verify.';
        this.alertType = 'success';
        this.showAlert = true;
        
        // Store the token in localStorage (or sessionStorage)
        localStorage.setItem('authToken', res.token);
        console.log('Generated Token:', res.token);
        
        // Reset form fields after successful submission
        this.addUserForm.reset();
        
        setTimeout(() => {
          this.showAlert = false;
          this.router.navigateByUrl('/all-users');
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
