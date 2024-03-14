import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../model/model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post(`${environment.BASE_URL}/auth/register`, user);
  }

  login(username: string, password: string) {
    const body = {
      username: username,
      password: password,
    };
    return this.http.post(`${environment.BASE_URL}/auth/login`, body);
  }

  logout(token: string) {
    localStorage.clear();
    sessionStorage.clear();
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
    return this.http.post(
      `${environment.BASE_URL}/auth/logout`,
      {},
      httpOptions
    );
  }
}
