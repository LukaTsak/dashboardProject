import { HttpClient, HttpHeaders, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceService {
  constructor(private http: HttpClient) {}

  sendEmail(obj: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    console.log('Sending email:', obj);

    return this.http.post('http://127.0.0.1:8000/api/registration', obj, {
      headers,
    });
  }
}
