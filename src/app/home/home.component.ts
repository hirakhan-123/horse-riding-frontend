import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  email: string = "info@horseclub.com";
  name: string = '';  // Store the user's name
  isLoggedIn: boolean = false;  // Track login status


  constructor() { }
router=inject(Router)

  logout(){
    localStorage.removeItem('loginUser')
    this.router.navigateByUrl('/loginMember');
  }


}
