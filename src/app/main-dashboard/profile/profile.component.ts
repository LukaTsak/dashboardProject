import { Component } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { NgClass } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';

@Component({
  selector: 'app-profile',
  imports: [NgClass, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(private apiService: ApiServiceService) {}
  ngOnInit() {
    this.apiService.getProfile().subscribe((response: any) => {
      // console.log('Profile Info:', response);
      // this.profileData = response.user;
      console.log(response.user);
      this.profileData = response.user;

      let mainUserdata = {
        updatedName: response.user?.name,
        updatedSurname: response.user?.surname,
        updatedEmail: response.user?.email,
        updatedPhone: response.user?.phone,
        updatedAddress: response.user?.address,
        updatedCity: response.user?.city,
        updatedCountry: response.user?.country_id,
        updatedDateOfBirth: response.user?.date_of_birth,
      };
      this.mainData = mainUserdata;
    });
  }

  profileData: any = {};
  mainData: any = {};

  updatedName = this.profileData?.name;
  updatedSurname: string = this.profileData?.surname || '';
  updatedEmail: string = this.profileData?.email || '';
  updatedPhone: string = this.profileData?.phone || '';
  updatedAddress: string = this.profileData?.address || '';
  updatedCity: string = this.profileData?.city || '';
  updatedCountry: string = this.profileData?.country_id || '';
  updatedDateOfBirth: string = this.profileData?.date_of_birth || '';

  updateProfile() {
    // console.log('Updated Name:', this.mainData.updatedName);
    // console.log('Updated Surname:', this.profileData.name);
    if (this.mainData.updatedName === this.profileData.name) {
      console.log('Name unchanged:', this.mainData.updatedName);
    } else {
      console.log('Name changed to:', this.profileData.name);
    }

    // console.log('Profile update function called');
  }
}
