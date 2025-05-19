import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-pre-signup',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './pre-signup.component.html',
  styleUrl: './pre-signup.component.scss'
})
export class PreSignupComponent {

  // ------------------------

  userType? : string = ''
  loginEmail? : string = ''

  // ------------------------
  onUserTypeChange(value: string) {
    console.log(value);

  }

  check(){
    console.log(this.loginEmail)
    console.log(this.userType)
  }
}

