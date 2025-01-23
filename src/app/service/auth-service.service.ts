import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // Method to get the Authorization headers
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Get token from localStorage
    if (!token) {
      throw new Error('No token found in localStorage');
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  // Example method to get user data with token
  getUserData() {
    const headers = this.getAuthHeaders();
    return this.http.get('http://localhost:8006/api/v1/auth/get-login-user', { headers });
  }
}
