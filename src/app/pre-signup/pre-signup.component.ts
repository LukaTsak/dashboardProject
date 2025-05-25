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

  userType?: string = '';
  loginEmail?: string = '';

  userMessage: string | null = null;

  showMessage(msg: string) {
    this.userMessage = msg;
    setTimeout(() => {
      this.userMessage = null; // hide after 3 seconds
    }, 3000);
  }

  check() {
    const obj = {
      email: this.loginEmail,
      user_type: this.userType,
      ambassador_uuid: '',
    };

    console.log('Sending email:', obj);

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
  }
}
