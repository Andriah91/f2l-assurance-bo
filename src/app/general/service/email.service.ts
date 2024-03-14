import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments';
@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  sendEmail(subject: string, email: string, message: string) {
    const data = {
      subject: subject,
      email: email,
      message: message,
    };
    return this.http.post(`${environments.BASE_URL}/send-email`, data);
  }
}
