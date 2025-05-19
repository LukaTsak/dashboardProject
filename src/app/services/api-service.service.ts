import {
  HttpClient,
  HttpHeaders,
  HttpClientModule,
} from '@angular/common/http';
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
    return this.http.post('http://127.0.0.1:8000/api/checkRegistrationToken', token)
  }
}
