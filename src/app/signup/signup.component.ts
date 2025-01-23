import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule,CommonModule,RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  email1:string='info@horseclub.com'
  alertMessage: string = '';
  alertType: string = '';
  showAlert: boolean = false;

  signupObj: FormGroup;

  constructor(private http: HttpClient, private router: Router) {
    this.signupObj = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      phone: new FormControl('', [Validators.required]),
      role: new FormControl('', [Validators.required]),
    });
  }

  // Handle signup action
  onSignup() {
    if (this.signupObj.invalid) {
      return; // Don't proceed if form is invalid
    }

    this.http.post("http://localhost:8006/api/v1/auth/signup", this.signupObj.value).subscribe(
      (res: any) => {
        this.alertMessage = 'An email has been sent to your account. Please verify.';
        this.alertType = 'success';
        this.showAlert = true;

        setTimeout(() => {
          this.showAlert = false;
          this.router.navigateByUrl('/loginMember');
        }, 3000);
      },
      (error: any) => {
        this.alertMessage = error.error.message || 'Error occurred. Please try again.';
        this.alertType = 'error';
        this.showAlert = true;

        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
      }
    );
  }
}

