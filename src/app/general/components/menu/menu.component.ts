import { Component, Input, OnInit } from "@angular/core";
import { LayoutService } from "../../service/app.layout.service";
import { MenuItem } from "primeng/api";

@Component({
  selector: "app-menu",
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit {
  @Input() typeMenu?: string = "";
  menu: MenuItem[] = [];
  isMenuOpen = false;
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    let data = {};

    const menuManager = {
      label: "",
      items: [
        {
          label: "Gestion clients",
          icon: "pi pi-fw pi-users",
          routerLink: ["/manager/utilsateur"],
        },
        {
          label: "Gestion administrateurs",
          icon: "pi pi-fw pi-shield",
          routerLink: ["/manager/administrateur"],
        },
        {
          label: "Gestion notifications",
          icon: "pi pi-fw pi-bell",
          routerLink: ["/manager/notification"],
        }, 
        {
          label: "Gestion publicités",
          icon: "pi pi-fw pi-images",
          routerLink: ["/manager/pub"],
        },
        {
          label: "Gestion cartes",
          icon: "pi pi-fw pi-credit-card",
          routerLink: ["/manager/carte"],
        }
      ],
      
    };

    this.typeMenu == "manager";
    data = menuManager;

    this.model = [data];
  }
}
