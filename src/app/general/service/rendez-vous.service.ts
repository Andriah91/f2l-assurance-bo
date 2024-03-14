import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class RendezVousService {
  constructor(private http: HttpClient) {}

  checkEmployeStatus(data: any): any {
    return this.http.post(`${environments.BASE_URL}/rendezVous/verifier`, data);
  }
}
