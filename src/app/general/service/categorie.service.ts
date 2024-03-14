import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environments } from 'src/environments/environments';
import { Categorie } from '../models/categorie';
@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  constructor(private http: HttpClient) {}

  createCategorie(body: Categorie) {
    return this.http.post(`${environments.BASE_URL}/categorie/create`, body);
  }

  getAllCategorie(): any {
    return this.http.get(`${environments.BASE_URL}/categorie/list`);
  }
}
