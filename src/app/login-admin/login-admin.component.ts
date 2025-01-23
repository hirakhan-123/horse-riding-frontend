import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-admin',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css'],
})
export class LoginAdminComponent {
  email1: string = 'admin@horseclub.com'; // Default email
  alertMessage: string = '';
  alertType: string = '';
  showAlert: boolean = false;

  loginObj: FormGroup;

  constructor(private http: HttpClient, private router: Router) {
    this.loginObj = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
    });
  }

  // Handle login action
  onLogin() {
    if (this.loginObj.invalid) {
      return; // Don't proceed if form is invalid
    }

    this.http.post("http://localhost:8006/api/v1/auth/login-admin", this.loginObj.value).subscribe(
      (res: any) => {
        localStorage.setItem('authToken', res.token);  // Save token
      console.log('token:', res.token);

      // Check if the token is successfully stored
      const token = localStorage.getItem('authToken');
      if (token) {
        this.alertMessage = 'Admin logged in successfully!';
        this.alertType = 'success';
        this.showAlert = true;

        setTimeout(() => {
          this.showAlert = false;
          this.router.navigateByUrl('/admin-dashboard'); // Navigate after token is stored
        }, 500);
      } else {
        this.alertMessage = 'Failed to store token';
        this.alertType = 'error';
        this.showAlert = true;
        setTimeout(() => {
          this.showAlert = false;
        }, 500);
      }
    },
    (error: any) => {
      this.alertMessage = error.error.message || 'Error occurred. Please try again.';
      this.alertType = 'error';
      this.showAlert = true;

      setTimeout(() => {
        this.showAlert = false;
      }, 500);
    }
  );
}
}
