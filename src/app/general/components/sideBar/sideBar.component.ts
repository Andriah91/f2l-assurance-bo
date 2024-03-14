import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { LayoutService } from '../../service/app.layout.service';

@Component({
  selector: 'app-sideBar',
  templateUrl: './sideBar.component.html',
  styleUrls: ['./sideBar.component.css']
})
export class SideBarComponent {
  @Input() typeMenu?: string = '';

  constructor(public layoutService: LayoutService, public el: ElementRef) { }

}
