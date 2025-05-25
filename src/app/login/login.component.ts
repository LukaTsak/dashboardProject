import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';
// import { Router } from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor(private apiService: ApiServiceService, private router: Router) {}

  passwordType = 'password';
  passInvisible: boolean = true;
  passVisible?: boolean;
  passwordCondition: boolean = false;

  email?: string = '';
  password?: string = '';

  userMessage: string | null = null;

  showMessage(msg: string) {
    this.userMessage = msg;
    setTimeout(() => {
      this.userMessage = null; // hide after 3 seconds
    }, 3000);
  }

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

  loginButton() {
    const obj = {
      email: this.email,
      password: this.password,
    };
    console.log('Sending login data:', obj);
    if (this.email && this.password) {
      this.apiService.Login(obj).subscribe({
        next: (response: any) => {
          console.log('Response:', response);
          this.showMessage('Login successful!');
          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 3000);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.showMessage(
            'Login failed: ' + (error.error?.message || 'Something went wrong')
          );
          return;
        },
      });
    }
  }

}