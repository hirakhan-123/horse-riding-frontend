import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email1:string='info@horseclub.com'
  alertMessage: string = '';
  alertType: string = '';
  showAlert: boolean = false;

  loginObj: FormGroup;

  constructor(private http: HttpClient, private router: Router) {
    this.loginObj = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  // Handle login action
  onLogin() {
    if (this.loginObj.invalid) {
      return; // Don't proceed if form is invalid
    }

    this.http.post("http://localhost:8006/api/v1/auth/login", this.loginObj.value).subscribe(
      (res: any) => {
        localStorage.setItem('authToken', res.token); // Store the token
        this.alertMessage = 'Logged in successfully!';
        this.alertType = 'success';
        this.showAlert = true;

        setTimeout(() => {
          this.showAlert = false;
          this.router.navigateByUrl('/layout/home');
        }, 500);
      },
      (error: any) => {
        this.alertMessage = error.error.message || 'Error occurred. Please try again.';
        this.alertType = 'error';
        this.showAlert = true;

        setTimeout(() => {
          this.showAlert = false;
        }, 5000);
      }
    );
  }

}
