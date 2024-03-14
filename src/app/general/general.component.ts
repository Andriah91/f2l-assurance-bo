import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-general',
  templateUrl: './general.component.html',
  styleUrls: ['./general.component.css'],
})
export class GeneralComponent implements OnInit {
  currentUrl: string;

  constructor(private router: Router) {
    this.currentUrl = this.router.url;
  }
  ngOnInit() { }
}
