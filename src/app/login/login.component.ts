import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule,RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  
  passwordType = 'password';
  passInvisible: boolean = true
  passVisible?: boolean
  passwordCondition : boolean = false

  makeVisible() {
    if (this.passwordType === 'password') {
      this.passwordType = 'text'
      this.passInvisible = false
      this.passVisible = true
    } else {
      this.passwordType === 'text';
      this.passwordType = 'password'
      this.passInvisible = true
      this.passVisible = false
    }
  }
}
