import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiServiceService {

  constructor(private http: HttpClient) { }

  sendEmail(obj: any) {
        return this.http.post(
      'http://127.0.0.1:8000/api/registration', obj
    );
  }
}
