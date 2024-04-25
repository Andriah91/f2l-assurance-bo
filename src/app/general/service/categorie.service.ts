import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core'; 
import { Categorie } from '../models/categorie';
@Injectable({
  providedIn: 'root',
})
export class CategorieService {
  constructor(private http: HttpClient) {}

  
}
