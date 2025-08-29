import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';
import { animationFrameScheduler } from 'rxjs';
import { Router } from '@angular/router';
import { error } from 'node:console';

@Component({
  selector: 'app-company-add',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './company-add.component.html',
  styleUrl: './company-add.component.scss'
})
export class CompanyAddComponent {
  constructor(private apiService: ApiServiceService, private router: Router) {}

  hasCompany = false;
  companyCheckComplete = false;

  ngOnInit() {
    const token =
      localStorage.getItem('access_token') ||
      sessionStorage.getItem('access_token');
    if (!token) {
      console.error('No access token found!');
      return;
    }

    this.apiService.getInfo().subscribe((response: any) => {
      this.hasCompany = response.current_company_id !== null;
      this.companyCheckComplete = true;
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
  domainAvailable: boolean = true;
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
  currentMarginPx = 10;
  currentView = 1;

  isActive = false;

  currentviewCount(x: any) {
    if (x === 1) {
      this.currentMarginPx = 10;
      this.currentView = 1;
    } else if (x === 2) {
      this.currentMarginPx = 66;
      this.currentView = 2;
    }
    // this.currentview++;
    console.log('Current View Count:', this.currentMarginPx);
    console.log('Current View:', this.currentView);
    console.log(this.isActive);
  }

  // ------------------------ message handling

  userMessage: string | null = null;

  showMessage(msg: string) {
    if (this.userMessageArray.includes(msg)) return;

    this.userMessageArray.push(msg);

    setTimeout(() => {
      this.userMessageArray = this.userMessageArray.filter((m) => m !== msg);
    }, 3000);
  }
  // ------------------------ doman handling

  checkDomainAvailability() {
  console.log('Checking domain:', this.companySubdomain);

  this.apiService
    .checkdomain({ sub_domain: this.companySubdomain })
    .subscribe({
      next: (response: any) => {
        console.log('Domain check response:', response);

        if (response.status === 'ok' || response.message?.toLowerCase().includes('available')) {
          this.domainAvailable = true;
        } else {
          this.domainAvailable = false;
        }
      },
      error: (error: any) => {
        const errorMsg = error.error?.message || error.message || 'Something went wrong';
        console.error('Error checking domain:', errorMsg);
        this.showMessage(errorMsg);
        if(this.companySubdomain)
        this.domainAvailable = false;
      }
    });
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
            this.router.navigate(['/dashboard']);
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

  logout() {
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }

  changeInpLang(langId: any) {
    console.log('changeInpLang called ' + langId);
    this.selectedDefaultLanguage = langId;
  }
}
