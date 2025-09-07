import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';
import { Router } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, RouterModule, ProfileComponent, FormsModule],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss',
})
export class MainDashboardComponent {
  constructor(
    private apiService: ApiServiceService,
    private router: Router,
    @Inject(PLATFORM_ID) private readonly platformId: Object
  ) {}

  ngOnInit() {
    this.apiService.getCompany().subscribe((response: any) => {
      console.log('Current Company Info:', response.company);
      this.currentCompany = response.company;
    });

    if (isPlatformBrowser(this.platformId)) {
      const token =
        window.localStorage?.getItem('access_token') ||
        window.sessionStorage?.getItem('access_token');
      if (!token) {
        console.error('No access token found!');
        return;
      }
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
    // console.log(this.currentCompany.name);
  }

  logout() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      sessionStorage.removeItem('access_token');
    }
    this.router.navigate(['/login']);
  }
}
