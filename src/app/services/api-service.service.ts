import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  constructor(private http: HttpClient) {}

  sendEmail(obj: any) {
    return this.http.post('http://127.0.0.1:8000/api/registration', obj);
  }

  getEmailByToken(token: any) {
    return this.http.post(
      'http://127.0.0.1:8000/api/checkRegistrationToken',
      token
    );
  }

  createNewAccount(obj: any) {
    return this.http.post(
      'http://127.0.0.1:8000/api/complete-user-registration',
      obj
    );
  }

  createNewAmbassador(obj: any) {
    return this.http.post(
      'http://127.0.0.1:8000/api/complete-ambassador-registration',
      obj
    );
  }

  Login(obj: any) {
    return this.http.post('http://127.0.0.1:8000/api/login', obj);
  }

  getCountries() {
    return this.http.get(
      'http://127.0.0.1:8000/api/complete-ambassador-registration/formData'
    );
  }

  forgotPassword(obj: any) {
    return this.http.post('http://127.0.0.1:8000/api/forgot-password', obj);
  }

  resetPassword(obj: any) {
    return this.http.post('http://127.0.0.1:8000/api/reset-password', obj);
  }

  company(token: string) {
  return this.http.get('http://127.0.0.1:8000/api/dashboard/companies/form-data', {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
}

createNewCompany(obj: any) {
  const token = localStorage.getItem('access_token');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });

  return this.http.post(
    'http://127.0.0.1:8000/api/dashboard/companies',
    obj,
    { headers }
  );
}



}
