import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';
import { animationFrameScheduler } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './main-dashboard.component.html',
  styleUrl: './main-dashboard.component.scss',
})
export class MainDashboardComponent {
  constructor(private apiService: ApiServiceService, private router: Router) {}


  hasCompany = false;

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found!');
      return;
    }

    this.apiService.getInfo().subscribe((response: any) => {
      console.log('Company Info:', response);
      // this.showMessage('Company created successfully!');
      if (response.current_company_id === null) {
        // this.router.navigate(['/dashboard']);
        console.log('User does not have a company, redirecting to signup...');
      } else {
        // this.router.navigate(['/signup']);
        console.log('User has a company, redirecting to dashboard...');
        this.hasCompany = true;
      }
    });

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

  companyNameTrans?: string = '';
  companyDescriptionTrans?: string = '';
  companyStateTrans?: string = '';
  companyCityTrans?: string = '';
  companyAddressTrans?: string = '';

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

    this.selectedLanguage = ''; // Reset selection after removing
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
    console.log(this.canGoNext);
    const formData = new FormData();

    // STEP 1
    formData.append('step1[country_id]', String(this.selectedCountry));
    formData.append(
      'step1[default_language_id]',
      String(this.selectedDefaultLanguage)
    );
    formData.append('step1[email]', this.companyEmail || '');
    formData.append('step1[phone]', this.companyPhone?.toString() || '');
    formData.append('step1[zip]', this.companyZipCode?.toString() || '');
    formData.append('step1[can_edit]', '1');
    formData.append('step1[searchable]', '1');
    formData.append('step1[sub_domain]', this.companySubdomain || '');
    formData.append('step1[languages][0]', '1');
    formData.append('step1[languages][1]', '2');

    // STEP 2 - Translations
    if (this.companyName) {
      formData.append('step2[translations][0][language_id]', '1');
      formData.append('step2[translations][0][name]', this.companyName);
      formData.append(
        'step2[translations][0][description]',
        this.companyDescription || ''
      );
      formData.append('step2[translations][0][state]', this.companyState || '');
      formData.append('step2[translations][0][city]', this.companyCity || '');
      formData.append(
        'step2[translations][0][address]',
        this.companyAddress || ''
      );
    }

    if (this.companyNameTrans) {
      formData.append('step2[translations][1][language_id]', '2');
      formData.append('step2[translations][1][name]', this.companyNameTrans);
      formData.append(
        'step2[translations][1][description]',
        this.companyDescriptionTrans || ''
      );
      formData.append(
        'step2[translations][1][state]',
        this.companyStateTrans || ''
      );
      formData.append(
        'step2[translations][1][city]',
        this.companyCityTrans || ''
      );
      formData.append(
        'step2[translations][1][address]',
        this.companyAddressTrans || ''
      );
    }

    // STEP 3 - Socials
    formData.append('step3[facebook]', this.companyFacebook || '');
    formData.append('step3[twitter]', this.companyTwitter || '');
    formData.append('step3[instagram]', this.companyInstagram || '');
    formData.append('step3[linkedIn]', this.companyLinkedIn || '');
    formData.append('step3[tiktok]', this.companyTiktok || '');
    formData.append('step3[latitude]', this.companyLatitude?.toString() || '');
    formData.append(
      'step3[longitude]',
      this.companyLongitude?.toString() || ''
    );

    const show = this.showMessage.bind(this);

    // ----------------- STEP 1 -----------------
    if (this.currentPage === 1 && this.canGoNext) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const fieldsFilled =
        this.companyEmail &&
        this.companyPhone &&
        this.companyZipCode &&
        this.companySubdomain &&
        this.selectedCountry &&
        this.selectedDefaultLanguage;

      const validators = [
        { valid: fieldsFilled, msg: 'Please fill all the fields' },
        {
          valid: emailRegex.test(this.companyEmail ?? ''),
          msg: 'Please enter a valid email address',
        },
        {
          valid: (this.companyPhone ?? '').toString().length >= 9,
          msg: 'Please enter a valid phone number with at least 9 digits',
        },
      ];

      for (const { valid, msg } of validators) {
        if (!valid) {
          show(msg);
          return;
        }
      }

      this.previousPage = this.currentPage;
      this.currentPage++;
    }

    // ----------------- STEP 2: Multiple Languages -----------------
    else if (
      this.currentPage === 2 &&
      this.canGoNext &&
      this.selectedLanguages.length > 1
    ) {
      const fieldsFilled =
        this.companyName &&
        this.companyDescription &&
        this.companyState &&
        this.companyCity &&
        this.companyAddress &&
        this.companyNameTrans &&
        this.companyDescriptionTrans &&
        this.companyStateTrans &&
        this.companyCityTrans &&
        this.companyAddressTrans;

      if (!fieldsFilled) {
        show('Please fill all the fields');
        return;
      }

      this.previousPage = this.currentPage;
      this.currentPage++;
      console.log('Current Page:', this.currentPage);
      console.log('Previous Page:', this.previousPage);
    }

    // ----------------- STEP 2: Single Language -----------------
    else if (
      this.currentPage === 2 &&
      this.canGoNext &&
      this.selectedLanguages.length === 1
    ) {
      const fieldsFilled =
        (this.companyName &&
          this.companyDescription &&
          this.companyState &&
          this.companyCity &&
          this.companyAddress) ||
        (this.companyNameTrans &&
          this.companyDescriptionTrans &&
          this.companyStateTrans &&
          this.companyCityTrans &&
          this.companyAddressTrans);

      if (!fieldsFilled) {
        show('Please fill all the fields');
        return;
      }

      this.previousPage = this.currentPage;
      this.currentPage++;
    }

    // ----------------- STEP 3 -----------------
    else if (this.currentPage === 3) {
      const fieldsFilled =
        this.companyFacebook &&
        this.companyTwitter &&
        this.companyInstagram &&
        this.companyLinkedIn &&
        this.companyTiktok &&
        this.companyLatitude &&
        this.companyLongitude;

      if (!fieldsFilled) {
        show('Please fill all the fields');
        return;
      } else if (this.companyLongitude) {
        this.apiService
          .createNewCompany(formData)
          .subscribe((response: any) => {
            console.log('Response:', response);
            this.showMessage(response.message);
            this.loading = false;
          });
      }
    }

    // Add extra language if present
    if (this.selectedLanguages.length > 1 && this.selectedLanguages[1]?.id) {
      formData.append('step1[languages][1]', this.selectedLanguages[1].id);
    }

    console.log(formData);
    console.log('deflang: ' + this.selectedDefaultLanguage);
    console.log(this.currentPage);

    if (this.currentPage === 1) {
      this.previousPage = 1;
    }
  }

  Previous() {
    if (this.canGoPrevious) {
      if (this.currentPage === 1) {
        this.previousPage = 1;
      }

      this.previousPage = this.currentPage;
      this.currentPage--;
      console.log('Current Page:', this.currentPage);
      console.log('Previous Page:', this.previousPage);
    }
  }

  changeInpLang(langId: any) {
    console.log('changeInpLang called ' + langId);
    this.selectedDefaultLanguage = langId;
  }
}
