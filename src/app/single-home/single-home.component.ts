import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-single-home',
  imports: [RouterLink,CommonModule,FormsModule],
  templateUrl: './single-home.component.html',
  styleUrl: './single-home.component.css'
})
export class SingleHomeComponent {
email:string="info@horseclub.com"
loginMember(){

}
loginAdmin(){
  
}
isLoggedIn(){

}
}
