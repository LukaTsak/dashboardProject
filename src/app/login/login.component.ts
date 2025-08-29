import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private apiService: ApiServiceService, private router: Router) {}

  ngOnInit() {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Ideally verify token or call a /me or /profile endpoint
      this.router.navigate(['/dashboard']);
    }
  }

  hasCompany = false;
  companyCheckComplete = false;

  // ------------------------ password visibility/functionality

  passwordType = 'password';
  passInvisible: boolean = true;
  passVisible?: boolean;
  passwordCondition: boolean = false;

  makeVisible() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text';
      this.passInvisible = false;
      this.passVisible = true;
    } else {
      this.passwordType === 'text';
      this.passwordType = 'password';
      this.passInvisible = true;
      this.passVisible = false;
    }
  }

  // ------------------------ user login data

  email?: string = '';
  password?: string = '';
  keepSignedIn: boolean = false;

  userMessageArray: string[] = [];

  // ------------------------ message handling

  userMessage: string | null = null;

  showMessage(msg: string) {
    if (this.userMessageArray.includes(msg)) return;

    this.userMessageArray.push(msg);

    setTimeout(() => {
      this.userMessageArray = this.userMessageArray.filter((m) => m !== msg);
    }, 3000);
  }

  // ------------------------ login function

  loginButton() {
    if (!this.email || !this.password) {
      this.showMessage('Please fill in all fields.');
    } else {
      const obj = {
        email: this.email,
        password: this.password,
      };
      console.log('Sending login data:', obj);
      if (this.email && this.password) {
        this.apiService.Login(obj).subscribe({
          next: (response: any) => {
            console.log('Response:', response);

            const token = response.access_token;
            if (
              typeof window !== 'undefined' &&
              token &&
              this.keepSignedIn == true
            ) {
              localStorage.setItem('access_token', token);
            } else if (
              typeof window !== 'undefined' &&
              token &&
              this.keepSignedIn == false
            ) {
              sessionStorage.setItem('access_token', token);
            }

            this.apiService.getInfo().subscribe((response: any) => {
              this.hasCompany = response.current_company_id !== null;
              this.companyCheckComplete = true;
            });

            this.showMessage('Login successful!');
            setTimeout(() => {
              if (this.hasCompany && this.companyCheckComplete) {
                this.router.navigate(['/dashboard']);
              } else {
                this.router.navigate(['/companyadd']);
              }
            }, 3000);
          },
          error: (error) => {
            console.error('Login failed:', error);
            this.showMessage(
              'Login failed: ' +
                (error.error?.message || 'Something went wrong')
            );
            return;
          },
        });
      }

      // ------------------------ spinner functionality

      const btn = document.getElementById(
        'sendBtn'
      ) as HTMLButtonElement | null;
      if (!btn) return;

      const text = btn.querySelector('.btn-text') as HTMLElement | null;
      const spinner = btn.querySelector('.spinner') as HTMLElement | null;
      if (!text || !spinner) return;

      btn.disabled = true;
      spinner.classList.remove('hidden');
      text.textContent = '';

      setTimeout(() => {
        btn.disabled = false;
        spinner.classList.add('hidden');
        text.textContent = 'Send Email';
      }, 3000);
    }
  }
}
