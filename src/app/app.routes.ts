import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PreSignupComponent } from './pre-signup/pre-signup.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignUpComponent},
    {path: 'complete-registration', component: SignUpComponent},
    {path: 'presignup', component: PreSignupComponent}
];
