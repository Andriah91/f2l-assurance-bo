import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() dataNumberShow: number= 3;
  @Input() offset:number=0;
  @Input() limit:number= this.dataNumberShow;
  @Input() currentPage=1;
  @Input() totalPages=0;

  @Output() changePage: EventEmitter<void> = new EventEmitter<void>();
  @Output() getPageNumbers: EventEmitter<void> = new EventEmitter<void>();


  getPagingNumbers(): void {
    this.getPageNumbers.emit();
  }

  executerFonction(newPage: any) {
    this.changePage.emit(newPage);
  }
  
  changingPage(newPage: any) {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.currentPage=newPage;
      this.offset=(this.dataNumberShow*(newPage-1));
      this.limit= this.dataNumberShow;
    }
  }

  getCustomPagesArray(): (number | string)[] {
    if (this.totalPages <= 1) {
      return [1];
    }

    const visiblePageCount = Math.min(this.totalPages, 5);
    const ellipsis = '...';
    const pageArray: (number | string)[] = [];

    if (this.totalPages <= visiblePageCount + 2) {
      this.generatePageRange(pageArray, 1, this.totalPages);
    } else if (this.currentPage <= 3) {
      this.generatePageRange(pageArray, 1, visiblePageCount);
      pageArray.push(ellipsis, this.totalPages);
    } else if (this.currentPage >= this.totalPages - 2) {
      pageArray.push(1, ellipsis);
      this.generatePageRange(
        pageArray,
        this.totalPages - visiblePageCount + 1,
        this.totalPages
      );
    } else {
      pageArray.push(1, ellipsis);
      this.generatePageRange(
        pageArray,
        this.currentPage - 1,
        this.currentPage + 1
      );
      pageArray.push(ellipsis, this.totalPages);
    }
    return pageArray;
  }

  generatePageRange(array: (number | string)[], start: number, end: number) {
    for (let i = start; i <= end; i++) {
      array.push(i);
    }
  }


}
