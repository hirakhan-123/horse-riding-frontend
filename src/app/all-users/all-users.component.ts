import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-all-users',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './all-users.component.html',
  styleUrls: ['./all-users.component.css'],
})
export class AllUsersComponent implements OnInit {
  users: any[] = [];
  isEditing = false;
  editUserForm: FormGroup;
  currentUserId: string | null = null;

  constructor(private http: HttpClient, private fb: FormBuilder, private router: Router) {
    this.editUserForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10,15}$/)]],
      role: ['admin', Validators.required],
    });
  }

  ngOnInit(): void {
    this.getAllUsers();
  }

  // Return headers, always include Authorization if token is present
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders();

    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  getAllUsers(): void {
    const headers = this.getAuthHeaders();  // Get the headers with token

    this.http.get('http://localhost:8006/api/v1/auth/get-login-user', { headers }).subscribe(
      (res: any) => {
        this.users = res;
      },
      (error) => {
        console.error('Error fetching users:', error);

      }
    );
  }

  editUser(user: any): void {
    this.isEditing = true;
    this.currentUserId = user._id;

    // Populate the form with the selected user's data
    this.editUserForm.setValue({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
    });
  }

  onEditSubmit(): void {
    if (this.editUserForm.invalid) {
      alert('Please fill out the form correctly.');
      return;
    }

    if (this.currentUserId) {
      const headers = this.getAuthHeaders();  // Get the headers with token

      this.http.patch(`http://localhost:8006/api/v1/auth/update/${this.currentUserId}`, this.editUserForm.value, { headers }).subscribe(
        (res: any) => {
          alert('User updated successfully');
          this.getAllUsers();
          this.isEditing = false; // Hide the edit form after successful update
        },
        (error) => {
          console.error('Error updating user:', error);
          alert('Failed to update user. Please try again.');
        }
      );
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
  }

  deleteUser(userId: string): void {
    console.log('Attempting to delete user with ID:', userId); // Log the user ID
    if (confirm('Are you sure you want to delete this user?')) {
      const headers = this.getAuthHeaders();  // Get the headers with token
  
      this.http.delete(`http://localhost:8006/api/v1/auth/delete-rider/${userId}`, { headers }).subscribe(
        (response: any) => {
          console.log('Delete response:', response); // Log the server response
          if (response.status === 'success') {
            alert('User deleted successfully');
            this.getAllUsers();  // Refresh the user list
          } else {
            console.error('Unexpected response:', response);
            alert('Failed to delete user. Please try again.');
          }
        },
        (error) => {
          console.error('Error deleting user:', error);
          alert('Failed to delete user. Please try again later.');
        }
      );
    }
  }
  
  
}
