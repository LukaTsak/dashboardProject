import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const baseurl = 'http://127.0.0.1:8000/api';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  private isBrowser: boolean;
  private token: string | null = null;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  private getToken(): string | null {
    if (this.isBrowser) {
      return (
        localStorage.getItem('access_token') ||
        sessionStorage.getItem('access_token')
      );
    }
    return null;
  }

  private getAuthHeaders(explicitToken?: string): HttpHeaders {
    this.token = explicitToken || this.getToken();
    const bearer = this.token ? `Bearer ${this.token}` : '';
    console.log('Authorization Header:', bearer);
    return new HttpHeaders(
      bearer ? { Authorization: bearer } : {}
    );
  }

  // Registration & Auth
  sendEmail(obj: any) {
    return this.http.post(`${baseurl}/registration`, obj);
  }

  getEmailByToken(token: any) {
    return this.http.post(`${baseurl}/checkRegistrationToken`, token);
  }

  createNewAccount(obj: any) {
    return this.http.post(`${baseurl}/complete-user-registration`, obj);
  }

  createNewAmbassador(obj: any) {
    return this.http.post(`${baseurl}/complete-ambassador-registration`, obj);
  }

  Login(obj: any) {
    return this.http.post(`${baseurl}/login`, obj);
  }

  forgotPassword(obj: any) {
    return this.http.post(`${baseurl}/forgot-password`, obj);
  }

  resetPassword(obj: any) {
    return this.http.post(`${baseurl}/reset-password`, obj);
  }

  // User & Dashboard
  getInfo() {
    return this.http.get(`${baseurl}/me`, {
      headers: this.getAuthHeaders(),
    });
  }

  company(token?: string) {
    return this.http.get(`${baseurl}/dashboard/companies/form-data`, {
      headers: this.getAuthHeaders(token),
    });
  }

  createNewCompany(obj: any) {
    return this.http.post(`${baseurl}/dashboard/companies`, obj, {
      headers: this.getAuthHeaders(),
    });
  }

  checkdomain(obj: any) {
    return this.http.get(`${baseurl}/dashboard/check-company-sub-domain`, {
      headers: this.getAuthHeaders(),
      params: obj,
    });
  }

  // Other
  getCountries() {
    return this.http.get(
      `${baseurl}/complete-ambassador-registration/formData`
    );
  }

  getCompany() {
    return this.http.get(`${baseurl}/dashboard/profile/current-company`, {
      headers: this.getAuthHeaders(),
    });
  }

  getProfile() {
    return this.http.get(`${baseurl}/dashboard/profile/user`, {
      headers: this.getAuthHeaders(),
    });
  }
}
