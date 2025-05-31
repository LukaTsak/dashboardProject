import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';

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

    this.apiService.getCountries().subscribe((countries: any) => {
      this.countries = (countries.countries || []).map((country: any) => ({
        name: country.name,
        id: country.id,
      }));
      console.log('Countries:', this.countries);
    });
  }

  // ------------------------ password visibility

  passwordType1 = 'password';
  passwordType2 = 'password';
  passInvisible1: boolean = true;
  passVisible1?: boolean;
  passInvisible2: boolean = true;
  passVisible2?: boolean;
  passwordCondition: boolean = false;

  // ------------------------ password requirements

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

  // ------------------------ user information

  loginNameSurname?: string = '';
  loginNumber?: string = '';
  loginEmail?: string = '';
  loginPassword?: string = '';
  loginConfirmPassword?: string = '';
  DateOfBirth?: string = '';
  Adress?: string = '';
  personalNumber?: string = '';
  token?: string = '';

  userMessage: string | null = null;
  userMessageArray: string[] = [];

  // ------------------------ dynamic countries dropdown

  getCities(country: any) {
    let selectedCountryid = this.countries.find((c) => c.name === country);
    if (selectedCountryid) {
      this.selectedCountryId = selectedCountryid.id;
    }

    this.cities = this.citiesByCountry[country] || [];
    console.log('Selected country:', country);
    console.log('Cities:', this.cities);
    console.log('Selected country ID:', this.selectedCountryId);
  }

  countries: {
    id: any;
    name: string;
    code: string;
  }[] = [];
  cities: string[] = [];
  languages = [];

  selectedCountry: string = '';
  selectedCity: string = '';
  selectedCountryId: string = '';

  citiesByCountry: { [key: string]: string[] } = {
    Georgia: ['Tbilisi', 'Batumi', 'Kutaisi'],
    'United States': ['New York', 'Los Angeles', 'Chicago'],
  };

  // ------------------------ message handling

  showMessage(msg: string) {
    if (this.userMessageArray.includes(msg)) return;

    this.userMessageArray.push(msg);

    setTimeout(() => {
      this.userMessageArray = this.userMessageArray.filter((m) => m !== msg);
    }, 3000);
  }

  // ------------------------ validation and password checks

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

  getAge(dateString: string): number {
    const today = new Date();
    const birthDate = new Date(dateString);

    if (birthDate.getFullYear() > today.getFullYear()) {
      this.showMessage('Birth year cannot be in the future');
      return -1;
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return Number(age);
  }

  // ------------------------ create account

  createAccount() {
    const show = this.showMessage.bind(this);

    // Validation rules
    const validators = [
      {
        valid: this.loginNameSurname?.includes(' '),
        msg: 'Please enter both name and surname',
      },
      {
        valid: /^\d{9}$/.test(this.loginNumber?.toString() || ''),
        msg: 'Please enter a valid 9-digit phone number',
      },
      {
        valid: /^\d{10}$/.test(this.personalNumber?.toString() || ''),
        msg: 'Please enter a valid 10-digit personal number',
      },
      {
        valid: !!this.selectedCity && !!this.selectedCountryId,
        msg: 'Please select country and city',
      },
      {
        valid: !!this.Adress,
        msg: 'Please fill address field',
      },
      {
        valid: !!this.DateOfBirth,
        msg: 'Please enter your date of birth',
      },
      {
        valid: this.getAge(this.DateOfBirth ?? '') > 18,
        msg: 'User must be over 18',
      },
      {
        valid: this.loginPassword === this.loginConfirmPassword,
        msg: 'Password and Confirm Password do not match',
      },
      {
        valid: this.paswordElligable,
        msg: 'Password does not meet the requirements',
      },
    ];

    // Run validation
    for (const { valid, msg } of validators) {
      if (!valid) {
        show(msg);
        return;
      }
    }

    // Proceed if valid
    const [name, ...surnameParts] = (this.loginNameSurname ?? '')
      .trim()
      .split(' ');
    const surname = surnameParts.join(' ');

    const userObj = {
      name,
      surname,
      phone: this.loginNumber?.toString() || '',
      password: this.loginPassword,
      password_confirmation: this.loginConfirmPassword,
      date_of_birth: this.DateOfBirth,
      address: this.Adress,
      personal_number: this.personalNumber?.toString() || '',
      city: this.selectedCity,
      country_id: this.selectedCountryId,
      token: this.token,
    };

    console.log('userObj:', userObj);

    this.apiService.createNewAmbassador(userObj).subscribe(
      (response: any) => {
        console.log('Response:', response);
        show(response.message);
        setTimeout(() => this.router.navigate(['/login']), 3000);
      },
      (error) => {
        console.error('Error:', error);
        show('Please check your information and try again');
      }
    );
  }
}
