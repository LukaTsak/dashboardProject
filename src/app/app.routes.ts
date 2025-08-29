import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PreSignupComponent } from './pre-signup/pre-signup.component';
import { MainDashboardComponent } from './main-dashboard/main-dashboard.component';
import { AmbassadorSignUpComponent } from './ambassador-sign-up/ambassador-sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CompanyAddComponent } from './company-add/company-add.component';

export const routes: Routes = [
    {path: '', redirectTo: 'login', pathMatch: 'full'},
    
    {path: 'login', component: LoginComponent},
    {path: 'signup', component: SignUpComponent},
    {path: 'complete-registration', component: SignUpComponent},
    {path: 'complete-ambassador-registration', component: AmbassadorSignUpComponent},
    {path: 'presignup', component: PreSignupComponent},
    {path: 'dashboard', component: MainDashboardComponent},
    {path: 'forgotPassword', component: ForgotPasswordComponent},
    {path: 'reset-password', component: ResetPasswordComponent},
    {path: 'checkPasswordToken', component: ResetPasswordComponent},
    {path: 'companyadd', component: CompanyAddComponent},


    {path: '**', redirectTo: 'login'}
];
