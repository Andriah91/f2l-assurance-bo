import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { ConfirmationService, MenuItem } from "primeng/api";
import { LayoutService } from "../../service/app.layout.service";
import { AuthService } from "src/app/auth/service/auth.service";
import { Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { ServiceService } from "src/app/manager/services/service.service";
import { CookieService } from "ngx-cookie-service";

@Component({
  selector: "app-top-bar",
  templateUrl: "./top-bar.component.html",
  styleUrls: ["./top-bar.component.css"],
})
export class TopBarComponent implements OnInit {
  items!: MenuItem[];

  @ViewChild("menubutton") menuButton!: ElementRef;

  @ViewChild("topbarmenubutton") topbarMenuButton!: ElementRef;

  @ViewChild("topbarmenu") menu!: ElementRef;

  menuItems: MenuItem[] = [];
  token: any;
  environments: any;

  userName:any ="";

  constructor(
    public layoutService: LayoutService,
    private cookieService: CookieService,
    public router: Router,
    private service: ServiceService,

    private confirmationService: ConfirmationService
  ) {}
  ngOnInit(): void {
    this.environments = environment;
    this.userName=this.service.findUser().first_name+" "+this.service.findUser().last_name;
    this.menuItems = [
      {
        separator: true,
      },
      {
        label: "Se deconnecter",
        icon: "pi pi-power-off",
        command: () => this.logout(),
      },
    ];
  }

  logout() {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Etes vous sur de se déconnecter?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptIcon: "none",
      rejectIcon: "none",
      rejectButtonStyleClass: "p-button-text",
      acceptLabel: "Oui", 
      rejectLabel: "Non",
      accept: () => {
        this.logoutCurrentUser();
      },
      reject: () => {},
    });
  }
  logoutCurrentUser(): void {
    const token = this.cookieService.get('sessionUser');
    if (!token) {
      console.error('Token non trouvé dans le cookie');
      return;
    }
    this.service.logout().subscribe(
      (data) => {
        console.log("Déconnexion réussie");
        this.cookieService.delete('sessionUser','/');
        this.router.navigate(['/auth/login']);
      },
      (error) => {
        console.error('Erreur lors de la déconnexion :', error);
      }
    );
  }
}
