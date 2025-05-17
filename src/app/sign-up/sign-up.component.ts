import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { log } from 'node:console';

@Component({
  selector: 'app-sign-up',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  passwordType1 = 'password';
  passwordType2 = 'password';
  passInvisible1: boolean = true;
  passVisible1?: boolean;
  passInvisible2: boolean = true;
  passVisible2?: boolean;
  passwordCondition: boolean = false;

  // ------------------------
  loginName? : string = ''
  loginEmail? : string = ''
  loginPassword? : string = ''
  loginConfirmPassword? : string = ''
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

  check(){
    console.log(this.loginName)
    console.log(this.loginEmail)
    console.log(this.loginPassword)
    console.log(this.loginConfirmPassword)
  }
}
