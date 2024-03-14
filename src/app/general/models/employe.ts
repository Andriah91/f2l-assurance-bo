export class Employe {
  _id: string = '';
  image: string = '';
  username: string = '';
  emplois: Emplois[] = [];
  pays: string = '';
  adresse: string = '';
  phone: string = '';
  email: string = '';
  role: string = '';
  salaire: Salaire[] = [];
  createdAt: string = '';
  updatedAt: string = '';
}

export class Emplois {
  nom: string = '';
  _id: string = '';
}

export class Salaire {
  date: Date = new Date();
  salaire: number = 0;
  _id: string = '';
}
