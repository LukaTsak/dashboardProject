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
      obj,
    );
  }

    createNewAmbassador(obj: any) {
    return this.http.post(
      'http://127.0.0.1:8000/api/complete-ambassador-registration',
      obj,
    );
  }

  Login(obj: any) {
    return this.http.post(
      'http://127.0.0.1:8000/api/login',
      obj,
    );    
  }

    getCountries() {
    return this.http.get(
      'http://127.0.0.1:8000/api/complete-ambassador-registration/formData'
    );    
  }
}
