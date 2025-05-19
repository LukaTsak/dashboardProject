import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiServiceService } from '../services/api-service.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-pre-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './pre-signup.component.html',
  styleUrl: './pre-signup.component.scss',
})
export class PreSignupComponent {
  constructor(private apiservice: ApiServiceService,
              private http: HttpClient,
  ) {}

  ngOnInit() {
    console.log('apiservice:', this.apiservice);
  }

  obj: any;

  userType?: string = '';
  loginEmail?: string = '';

  check() {
    console.log(this.loginEmail);
    console.log(this.userType);

    const obj = {
      email: this.loginEmail,
      user_type: this.userType,
      ambassador_uuid: '',
    };

    console.log(obj);

    this.apiservice.sendEmail(obj).subscribe((res: any) => {
      console.log(res);
    });
  }
}
