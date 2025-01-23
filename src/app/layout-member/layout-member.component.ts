import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-layout-member',
  imports: [RouterLink,RouterOutlet],
  templateUrl: './layout-member.component.html',
  styleUrl: './layout-member.component.css'
})
export class LayoutMemberComponent {
  email: string = "info@horseclub.com";
  router=inject(Router)

  
  logout(){
    localStorage.removeItem('loginUser')
    this.router.navigateByUrl('/loginMember');
  }
}
