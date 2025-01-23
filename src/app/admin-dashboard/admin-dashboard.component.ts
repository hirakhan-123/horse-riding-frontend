import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterLink,CommonModule,RouterOutlet],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  isDashboardRoute: boolean = false;
  isPageReady: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Listen for route changes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateRouteStatus();
      });

    // Initial route check
    this.updateRouteStatus();
  }

  private updateRouteStatus() {
    this.isDashboardRoute = this.router.url === '/admin-dashboard';
    this.isPageReady = true; // Mark page as ready after route evaluation
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigateByUrl('/loginAdmin');
  }
}