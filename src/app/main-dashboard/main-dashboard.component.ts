import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';
import { Router } from '@angular/router';
import { ProfileComponent } from "./profile/profile.component";

@Component({
  selector: 'app-main-dashboard',
  imports: [CommonModule, RouterModule, ProfileComponent],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss',
})
export class MainDashboardComponent {
  constructor(private apiService: ApiServiceService, private router: Router) {}

  ngOnInit() {
    this.apiService.getCompany().subscribe((response: any) => {
      console.log('Current Company Info:', response.company);
      this.currentCompany = response.company;
    });

    const token =
      localStorage?.getItem('access_token') ||
      sessionStorage?.getItem('access_token');
    if (!token) {
      console.error('No access token found!');
      return;
    }
  }

  currentCompany: any;
  currentMarginPx = 20;
  currentView = 1;
  isActive = false;

  currentviewCount(x: number) {
    if (x === 1) {
      this.currentMarginPx = 20;
      this.currentView = 1;
    } else if (x === 2) {
      this.currentMarginPx = 76;
      this.currentView = 2;
    }
    console.log('Current View Count:', this.currentMarginPx);
    console.log('Current View:', this.currentView);
    console.log(this.isActive);
    console.log(this.currentCompany.name);
  }

  logout() {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}
