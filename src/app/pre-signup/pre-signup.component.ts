import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-pre-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pre-signup.component.html',
  styleUrl: './pre-signup.component.scss',
})
export class PreSignupComponent {
  constructor(private apiService: ApiServiceService) {}

  // ------------------------ user info

  userType?: string = '';
  loginEmail?: string = '';

  loading = false;

  // ------------------------ message handling

  userMessage: string | null = null;

  showMessage(msg: string) {
    this.userMessage = msg;
    setTimeout(() => {
      this.userMessage = null; // hide after 3 seconds
    }, 3000);
  }

  sendEmail() {
    const obj = {
      email: this.loginEmail,
      user_type: this.userType,
      ambassador_uuid: '',
    };

    console.log('Sending email:', obj);

    // ------------------------ api service call

    this.apiService.sendEmail(obj).subscribe(
      (response: any) => {
        console.log('Response:', response);
        this.showMessage(response.message);
      },
      (error) => {
        this.showMessage(error.error.message);
        console.error('Error:', error);
      }
    );

    // ------------------------ spinner functionality

    const btn = document.getElementById('sendBtn') as HTMLButtonElement | null;
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
