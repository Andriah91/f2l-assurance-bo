import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments';

@Injectable({
  providedIn: 'root',
})
export class EmployeService {
  constructor(private http: HttpClient) {}

  getAllEmploye(): any {
    return this.http.get(`${environments.BASE_URL}/employe/list`);
  }

  getAllEmployeByEmploye(): any {
    return this.http.get(`${environments.BASE_URL}/employe/list/categori`);
  }
}
