import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  constructor(private apiService: ApiServiceService) {}

  // ------------------------ user info


  loginEmail?: string = '';

  loading = false;
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

  // ------------------------ send email 

  sendEmail() {
    console.log('email:', this.loginEmail);
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    // ------------------------ input validation

    if (!this.loginEmail) {
      this.showMessage('Please fill in all fields.');
    } else if (!emailRegex.test(this.loginEmail)) {
      this.showMessage('Please enter a valid email address.');
    } else {
      const obj = {
        email: this.loginEmail,
      };

      console.log('Sending email:', obj);

      // ------------------------ api service call

      this.apiService.forgotPassword(obj).subscribe(
        (response: any) => {
          console.log('Response:', response);
          this.showMessage(response.status);
        },
        (error) => {
          this.showMessage(error.error.message);
          console.error('Error:', error);
        }
      );

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
