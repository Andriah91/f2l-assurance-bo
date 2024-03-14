import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CurrentDateService {

  constructor(private datePipe: DatePipe) { }

  getCurrentDateFormatted(format: string): string {
    const currentDate = new Date();
    return this.datePipe.transform(currentDate, format);
  }
}
