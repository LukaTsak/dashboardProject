import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { ApiServiceService } from '../../services/api-service.service';
import { NgClass } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [NgClass, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  constructor(private apiService: ApiServiceService,@Inject(PLATFORM_ID) private readonly platformId: Object) {}
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

  userMessageArray: string[] = [];


  // updatedName = this.profileData?.name;
  // updatedSurname: string = this.profileData?.surname || '';
  // updatedEmail: string = this.profileData?.email || '';
  // updatedPhone: string = this.profileData?.phone || '';
  // updatedAddress: string = this.profileData?.address || '';
  // updatedCity: string = this.profileData?.city || '';
  // updatedCountry: string = this.profileData?.country_id || '';
  // updatedDateOfBirth: string = this.profileData?.date_of_birth || '';

  showMessage(msg: string) {
    if (this.userMessageArray.includes(msg)) return;

    this.userMessageArray.push(msg);

    setTimeout(() => {
      this.userMessageArray = this.userMessageArray.filter((m) => m !== msg);
    }, 3000);
  }

  updateProfile() {
  const changes: any = {};

  for (const key in this.mainData) {
    if (this.mainData.hasOwnProperty(key)) {
      // map mainData key to profileData key
      const profileKey = key.replace(/^updated/, '').replace(/^\w/, c => c.toLowerCase());

      const newValue = this.profileData[profileKey];

      // ignore if new value is undefined
      if (newValue === undefined) continue;

      // check if value changed
      if (newValue !== this.mainData[key]) {
        changes[profileKey] = {
          old: this.mainData[key],
          new: newValue
        };
      }
    }
  }

  if (Object.keys(changes).length === 0) {
    this.showMessage('No changes detected');
  } else {
    this.showMessage('Changed fields:' + changes);

    // call API here to update backend with `changes`
    // this.apiService.updateProfile(changes).subscribe(...)
  }
}

}
