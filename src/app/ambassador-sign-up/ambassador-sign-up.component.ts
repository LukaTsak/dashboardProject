import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Country, State, City } from 'country-state-city';

@Component({
  selector: 'app-ambassador-sign-up',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ambassador-sign-up.component.html',
  styleUrl: './ambassador-sign-up.component.scss',
})
export class AmbassadorSignUpComponent {
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiServiceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const token = params['token'];
      console.log('Token:', token);
      let tokenObj = {
        token: token,
      };
      this.token = token;

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

  loginNameSurname?: string = '';
  loginNumber?: string = '';
  loginEmail?: string = '';
  loginPassword?: string = '';
  loginConfirmPassword?: string = '';
  DateOfBirth?: string = '';
  Adress?: string = '';
  personalNumber?: string = '';
  token?: string = '';

  // ------------------------

  userMessage: string | null = null;
  userMessageArray: string[] = [];

  // countries = Country.getAllCountries();
  // states = State.getAllStates();
  // cities = City.getAllCities();
  

  showMessage(msg: string) {
    this.userMessageArray.push(msg);
    setTimeout(() => {
      this.userMessageArray = []; // hide after 3 seconds
    }, 3000);
  }

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

  getAge(dateString: string): number {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--; // birthday hasn't happened yet this year
    }

    return age;
  }

  check() {
    if (this.loginPassword !== this.loginConfirmPassword) {
      this.showMessage('Password and Confirm Password do not match');
      return;
    } else if (!this.paswordElligable) {
      this.showMessage('Password does not meet the requirements');
    } else {
      // ------------------------

      const parts = (this.loginNameSurname ?? '').trim().split(' ');
      const name = parts[0];
      const surname = parts.slice(1).join(' ');

      // ------------------------
      const userObj = {
        name: name,
        surname: surname,
        phone: this.loginNumber?.toString() || '',
        password: this.loginPassword,
        password_confirmation: this.loginConfirmPassword,
        token: this.token,
      };

      console.log('email: ' + this.loginEmail);
      console.log('name: ' + name);
      console.log('surname: ' + surname);
      console.log('number: ' + this.loginNumber);
      console.log('password: ' + this.loginPassword);
      console.log('confirmpass: ' + this.loginConfirmPassword);
      console.log('DateOfBirth: ' + this.DateOfBirth);
      console.log('Adress: ' + this.Adress);
      console.log('personalNumber: ' + this.personalNumber);
      console.log('token: ' + this.token);
      console.log('userObj:', userObj);

      // console.log(Country.getAllCountries());
      // console.log(State.getAllStates());
      // console.log(City.getAllCities());

      this.apiService.createNewAccount(userObj).subscribe(
        (response: any) => {
          console.log('Response:', response);
          this.showMessage(response.message);
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        (error) => {
          console.error('Error:', error);
          this.showMessage('please check your information and try again');
        }
      );
    }

    if (!this.loginNameSurname?.includes(' ')) {
      this.showMessage('Please enter both name and surname');
      return;
    }

    if (!this.DateOfBirth) return;

    const age = this.getAge(this.DateOfBirth);

    if (age < 18) {
      this.showMessage('User must be over 18');
    }
  }

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
}
