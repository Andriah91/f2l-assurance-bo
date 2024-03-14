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
      label: "Manager",
      items: [
        {
          label: "Gestion Utilisateur",
          icon: "pi pi-fw pi-user",
          routerLink: ["/manager/utilsateur"],
        }
      ],
    };

    this.typeMenu == "manager";
    data = menuManager;

    this.model = [data];
  }
}
