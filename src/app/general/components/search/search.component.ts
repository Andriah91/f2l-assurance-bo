import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss'
})
export class SearchComponent {
  @Input() keyword: string;
  @Output() searchs: EventEmitter<void> = new EventEmitter<void>();

  executerFonction(keyWord): void {
    this.searchs.emit(keyWord);
  }

}
