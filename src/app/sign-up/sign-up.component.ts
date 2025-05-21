import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiServiceService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      console.log('Token:', token);
      let tokenObj = {
        token: token,
      };

      this.apiService.getEmailByToken(tokenObj).subscribe((response: any) => {
        console.log('Response:', response.email);
        this.loginEmail = response.email;
      });
    });
  }

  passwordType1 = 'password';
  passwordType2 = 'password';
  passInvisible1: boolean = true;
  passVisible1?: boolean;
  passInvisible2: boolean = true;
  passVisible2?: boolean;
  passwordCondition: boolean = false;

  // ------------------------

  passwordCheckColor: string = 'red';
  paswordElligable: boolean = false;
  atLeast8: string = 'white';
  oneUpperCase: string = 'white';
  oneDigit: string = 'white';
  oneSymbol: string = 'white';

  isLongEnough: boolean = false;
  hasUppercase: boolean = false;
  hasNumber: boolean = false;
  hasSymbol: boolean = false;

  // ------------------------

  loginName?: string = '';
  loginEmail?: string = '';
  loginPassword?: string = '';
  loginConfirmPassword?: string = '';

  // ------------------------

  makeVisible(x: number) {
    if (x == 1) {
      if (this.passwordType1 === 'password') {
        this.passwordType1 = 'text';
        this.passInvisible1 = false;
        this.passVisible1 = true;
      } else {
        this.passwordType1 === 'text';
        this.passwordType1 = 'password';
        this.passInvisible1 = true;
        this.passVisible1 = false;
      }
    }
    if (x == 2) {
      if (this.passwordType2 === 'password') {
        this.passwordType2 = 'text';
        this.passInvisible2 = false;
        this.passVisible2 = true;
      } else {
        this.passwordType2 === 'text';
        this.passwordType2 = 'password';
        this.passInvisible2 = true;
        this.passVisible2 = false;
      }
    }
  }

  check() {
    if (this.loginPassword !== this.loginConfirmPassword) {
      alert('Password and Confirm Password do not match');
      return;
    } 
    else if(!this.paswordElligable) {
      alert('Password does not meet the requirements');
    }
    
    else {
      console.log(this.loginEmail);
      console.log(this.loginName);
      console.log(this.loginPassword);
      console.log(this.loginConfirmPassword);
      alert('Account Created');
    }
  }

  passwordCheck() {
    const password = this.loginPassword ?? '';
    const length = password.length;

    if (length >= 8) {
      this.atLeast8 = 'green';
      this.isLongEnough = true;
    } else {
      this.atLeast8 = 'white';
      this.isLongEnough = false;
    }

    if (/[A-Z]/.test(password)) {
      this.oneUpperCase = 'green';
      this.hasUppercase = true;
    } else {
      this.oneUpperCase = 'white';
      this.hasUppercase = false;
    }

    if (/\d/.test(password)) {
      this.oneDigit = 'green';
      this.hasNumber = true;
    } else {
      this.oneDigit = 'white';
      this.hasNumber = false;
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      this.oneSymbol = 'green';
      this.hasSymbol = true;
    } else {
      this.oneSymbol = 'white';
      this.hasSymbol = false;
    }

    if (
      this.isLongEnough &&
      this.hasUppercase &&
      this.hasNumber &&
      this.hasSymbol
    ) {
      this.passwordCheckColor = 'green';
      this.paswordElligable = true;
    } else {
      this.passwordCheckColor = 'red';
    }
  }
}
