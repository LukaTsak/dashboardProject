import { Component } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';

@Component({
  selector: 'app-profile',
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(private apiService: ApiServiceService) {}
  ngOnInit() {
    this.apiService.getProfile().subscribe((response: any) => {
      // console.log('Profile Info:', response);
      this.profileData = response.user;
      console.log(this.profileData);
    });
  }

  profileData: any;
}
