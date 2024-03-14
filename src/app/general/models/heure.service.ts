import { Injectable } from '@angular/core';

@Injectable()
export class HeureService {
  getProductsData() {
    return [
      {
        id: 0,
        name: '08:00',
      },
      {
        id: 1,
        name: '09:00',
      },
      {
        id: 2,
        name: '10:00',
      },
      {
        id: 3,
        name: '11:00',
      },
      {
        id: 4,
        name: '12:00',
      },
      {
        id: 5,
        name: '13:00',
      },
      {
        id: 6,
        name: '14:00',
      },
      {
        id: 7,
        name: '15:00',
      },
      {
        id: 8,
        name: '16:00',
      },
    ];
  }
}
