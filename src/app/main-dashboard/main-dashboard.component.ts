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

  companyLogo?: string = '';
  companySubdomain?: string = '';
  companyZipCode?: string = '';
  companyPhone?: string = '';
  companyEmail?: string = '';
  companyDefaultLanguage?: string = '';
  companyLanguages?: string = '';
  companyCountry?: string = '';

  loading = false;
  userMessageArray: string[] = [];

  // ------------------------ page info

    isFirstStepSliding = false;
    

  currentPage = 1

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

  Previous(){
    console.log('hi')
  }

  next() {
    this.isFirstStepSliding = true;

    // არჩევითად, შეგიძლია დაგვიანებით შეცვალო გვერდი
    setTimeout(() => {
      // განაახლე currentPage ან გააკეთე სხვა ლოგიკა
      this.currentPage++;
      this.isFirstStepSliding = false; // თუ გინდა ხელახლა გამოჩნდეს
    }, 500); // შეესაბამება ანიმაციის ხანგრძლივობას
  }
}
