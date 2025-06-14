import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';
import { animationFrameScheduler } from 'rxjs';

@Component({
  selector: 'app-main-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss',
})
export class MainDashboardComponent {
  constructor(private apiService: ApiServiceService) {}

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found!');
      return;
    }

    this.apiService.company(token).subscribe((countries: any) => {
      this.countries = (countries.countries || []).map((country: any) => ({
        name: country.name,
        id: country.id,
      }));
      this.languages = (countries.languages || []).map((language: any) => ({
        name: language.name,
        id: language.id,
      }));
      console.log('Countries:', this.countries);
      console.log('Languages:', this.languages);
    });
  }

  // ------------------------ company info

  loading = false;
  userMessageArray: string[] = [];

  // ------------------------ page info

  // Step 1
  companyLogo?: string = '';
  companySubdomain?: string = '';
  companyZipCode?: string = '';
  companyPhone?: string = '';
  companyEmail?: string = '';
  companyDefaultLanguage?: string = '';
  companyLanguages?: string = '';
  companyCountry?: string = '';

  // Step 2
  companyName?: string = '';
  companyDescription?: string = '';
  companyState?: string = '';
  companyCity?: string = '';
  companyAddress?: string = '';

  // Step 3
  companyFacebook?: string = '';
  companyTwitter?: string = '';
  companyInstagram?: string = '';
  companyLinkedIn?: string = '';
  companyTiktok?: string = '';
  companyLatitude?: string = '';
  companyLongitude?: string = '';

  currentPage = 1;
  previousPage = 1;

  // ------------------------ message handling

  userMessage: string | null = null;

  showMessage(msg: string) {
    if (this.userMessageArray.includes(msg)) return;

    this.userMessageArray.push(msg);

    setTimeout(() => {
      this.userMessageArray = this.userMessageArray.filter((m) => m !== msg);
    }, 3000);
  }

  // ------------------------ logo handling

  selectedLogoFileName: string = '';
  logoPreviewUrl: string | ArrayBuffer | null = null;

  onLogoSelected(event: any): void {
    const file = event.target.files[0];
    this.logoPreviewUrl = null;
    this.selectedLogoFileName = '';
    this.companyLogo = '';

    if (file) {
      const reader = new FileReader();
      const image = new Image();

      reader.onload = (e: any) => {
        image.onload = () => {
          const width = image.width;
          const height = image.height;

          if (width !== height) {
            this.showMessage(
              `Logo must be a square (equal width and height). Uploaded: ${width}x${height}`
            );
            return;
          }

          // ✅ Valid image
          this.logoPreviewUrl = e.target.result;
          this.companyLogo = file;
          this.selectedLogoFileName = file.name;
        };

        image.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.logoPreviewUrl = '';
    this.selectedLogoFileName = '';
    this.companyLogo = '';
  }

  // ------------------------ languages handling

  countries: {
    id: any;
    name: string;
    code: string;
  }[] = [];
  languages: {
    id: any;
    name: string;
    code: string;
  }[] = [];
  selectedLanguages: any[] = [];

  selectedCountry: string = '';
  selectedDefaultLanguage: string = '';
  selectedLanguage: any = null;
  selectedCountryId: string = '';

  addLanguagesToList(selectedLang: any) {
    if (
      selectedLang &&
      !this.selectedLanguages.some((lang) => lang.id === selectedLang.id)
    ) {
      this.selectedLanguages.push(selectedLang);
    }
    this.selectedLanguage = null; // Reset selection after adding
  }

  delLang(langToRemove: any) {
    this.selectedLanguages = this.selectedLanguages.filter(
      (lang) => lang.id !== langToRemove.id
    );
  }

  // ------------------------ buttons

  // sendEmail() {
  //   console.log('email:', this.loginEmail);
  //   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  //   // ------------------------ input validation

  //   if (!this.loginEmail) {
  //     this.showMessage('Please fill in all fields.');
  //   } else if (!emailRegex.test(this.loginEmail)) {
  //     this.showMessage('Please enter a valid email address.');
  //   } else {
  //     const obj = {
  //       email: this.loginEmail,
  //     };

  //     console.log('Sending email:', obj);

  //     // ------------------------ api service call

  //     this.apiService.forgotPassword(obj).subscribe(
  //       (response: any) => {
  //         console.log('Response:', response);
  //         this.showMessage(response.status);
  //       },
  //       (error) => {
  //         this.showMessage(error.error.message);
  //         console.error('Error:', error);
  //       }
  //     );

  //     // ------------------------ spinner functionality

  //     const btn = document.getElementById(
  //       'sendBtn'
  //     ) as HTMLButtonElement | null;
  //     if (!btn) return;

  //     const text = btn.querySelector('.btn-text') as HTMLElement | null;
  //     const spinner = btn.querySelector('.spinner') as HTMLElement | null;
  //     if (!text || !spinner) return;

  //     btn.disabled = true;
  //     spinner.classList.remove('hidden');
  //     text.textContent = '';

  //     setTimeout(() => {
  //       btn.disabled = false;
  //       spinner.classList.add('hidden');
  //       text.textContent = 'Send Email';
  //     }, 3000);
  //   }
  // }

  get canGoNext() {
    return this.currentPage < 3;
  }

  get canGoPrevious() {
    return this.currentPage > 1;
  }

  next() {
    if (this.canGoNext) {
      this.previousPage = this.currentPage;
      this.currentPage++;
    }
    let singleLanguage: any = {
      'step1[country_id]': this.selectedCountry,
      'step1[default_language_id]': this.selectedDefaultLanguage,
      'step1[email]': this.companyEmail,
      'step1[phone]': this.companyPhone,
      'step1[zip]': this.companyZipCode,
      'step1[logo]': this.selectedLogoFileName,
      'step1[can_edit]': 1,
      'step1[searchable]': 1,
      'step1[sub_domain]': this.companySubdomain,
      'step1[languages][0]': this.selectedLanguages[0]?.id,
      'step2[translations][0][language_id]': this.selectedDefaultLanguage,
      'step2[translations][0][name]': this.companyName,
      'step2[translations][0][description]': this.companyDescription,
      'step2[translations][0][state]': this.companyState,
      'step2[translations][0][city]': this.companyCity,
      'step2[translations][0][address]': this.companyAddress,
      'step3[facebook]': this.companyFacebook,
      'step3[twitter]': this.companyTwitter,
      'step3[instagram]': this.companyInstagram,
      'step3[linkedIn]': this.companyLinkedIn,
      'step3[tiktok]': this.companyTiktok,
      'step3[latitude]': this.companyLatitude,
      'step3[longitude]': this.companyLongitude,
    };

    if (this.selectedLanguages.length > 1 && this.selectedLanguages[1]?.id) {
      singleLanguage['step1[languages][1]'] = this.selectedLanguages[1].id;
    }

    let multiLanguage = {
      'step1[country_id]': 1,
      'step1[default_language_id]': 1,
      'step1[email]': 'example@company.com',
      'step1[phone]': '+1234567890',
      'step1[zip]': '12345',
      'step1[can_edit]': 1,
      'step1[searchable]': 1,
      'step1[sub_domain]': 'my-company127',
      'step1[languages][0]': 1,
      'step1[languages][1]': 2,
      'step2[translations][0][language_id]': 1,
      'step2[translations][0][name]': 'My Company EN',
      'step2[translations][0][description]': 'Description in English',
      'step2[translations][0][state]': 'State EN',
      'step2[translations][0][city]': 'City EN',
      'step2[translations][0][address]': 'Address EN',
      'step2[translations][1][language_id]': 2,
      'step2[translations][1][name]': 'My Company FR',
      'step2[translations][1][description]': 'Description in French',
      'step2[translations][1][state]': 'State FR',
      'step2[translations][1][city]': 'City FR',
      'step2[translations][1][address]': 'Address FR',
      'step3[facebook]': 'https://facebook.com',
      'step3[twitter]': 'https://twitter.com',
      'step3[instagram]': 'https://instagram.com',
      'step3[linkedIn]': 'https://linkedin.com',
      'step3[tiktok]': 'https://tiktok.com',
      'step3[latitude]': 40.7128,
      'step3[longitude]': -74.006,
    };

    console.log(singleLanguage);
  }

  Previous() {
    if (this.canGoPrevious) {
      this.previousPage = this.currentPage;
      this.currentPage--;
    }
  }
}
