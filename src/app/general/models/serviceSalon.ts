import { Categorie } from './categorie';

export class ServiceSalon {
  _id: string = '';
  name: string = '';
  description: string = '';
  dure: number = 0;
  prix: number = 0;
  commision: number = 0;
  id_Categorie: Categorie = new Categorie();
  image: any[] = [];
}
