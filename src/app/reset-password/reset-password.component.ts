import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
})
export class ResetPasswordComponent {
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      const email = params['email'];
      console.log('Token:', token, 'email:', email);
      let tokenObj = {
        token: token,
      };
      this.token = token;
      this.loginEmail = email;

      // this.apiService.getEmailByToken(tokenObj).subscribe(
      //   (response: any) => {
      //     console.log('Response:', response.email);
      //     this.loginEmail = response.email;
      //   },
      //   (error) => {
      //     // this.showMessage(error.error.message);
      //     console.error('Error:', error);
      //   }
      // );
    });
  }

  // ------------------------ user info

  loginEmail?: string = '';
  loginPassword?: string = '';
  loginConfirmPassword?: string = '';
  token?: string = '';

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

  // ------------------------ password visibility

  passwordType1 = 'password';
  passwordType2 = 'password';
  passInvisible1: boolean = true;
  passVisible1?: boolean;
  passInvisible2: boolean = true;
  passVisible2?: boolean;
  passwordCondition: boolean = false;

  // ------------------------ password requirements/handling

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

  passwordCheck() {
    const password = this.loginPassword ?? '';

    this.isLongEnough = password.length >= 8;
    this.hasUppercase = /[A-Z]/.test(password);
    this.hasNumber = /\d/.test(password);
    this.hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    this.atLeast8 = this.isLongEnough ? 'green' : 'white';
    this.oneUpperCase = this.hasUppercase ? 'green' : 'white';
    this.oneDigit = this.hasNumber ? 'green' : 'white';
    this.oneSymbol = this.hasSymbol ? 'green' : 'white';

    this.paswordElligable =
      this.isLongEnough &&
      this.hasUppercase &&
      this.hasNumber &&
      this.hasSymbol;

    this.passwordCheckColor = this.paswordElligable ? 'green' : 'red';
  }

  makeVisible(x: number) {
    const typeKey = `passwordType${x}` as keyof this;
    const invisibleKey = `passInvisible${x}` as keyof this;
    const visibleKey = `passVisible${x}` as keyof this;

    if (this[typeKey] === 'password') {
      (this as any)[typeKey] = 'text';
      (this as any)[invisibleKey] = false;
      (this as any)[visibleKey] = true;
    } else {
      (this as any)[typeKey] = 'password';
      (this as any)[invisibleKey] = true;
      (this as any)[visibleKey] = false;
    }
  }

  // ------------------------ send email

  sendEmail() {
    const show = this.showMessage.bind(this);

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validators = [
      {
        valid: this.loginPassword === this.loginConfirmPassword,
        msg: 'Password and Confirm Password do not match',
      },
      {
        valid: this.paswordElligable,
        msg: 'Password does not meet the requirements',
      },
    ];

    for (const { valid, msg } of validators) {
      if (!valid) {
        show(msg);
        return;
      }
    }

    const obj = {
      email: this.loginEmail,
      password: this.loginPassword,
      password_confirmation: this.loginConfirmPassword,
      token: this.token,
    };

    console.log('Sending email:', obj);

    // ------------------------ api service call

    this.apiService.resetPassword(obj).subscribe(
      (response: any) => {
        console.log('Response:', response);
        show(response.message);
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 3000);
      },
      (error) => {
        show(error.error.message);
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
