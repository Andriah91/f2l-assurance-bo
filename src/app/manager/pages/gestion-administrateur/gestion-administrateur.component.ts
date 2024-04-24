import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { ConfirmationService, MessageService } from "primeng/api";
import { ServiceService } from "../../services/service.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { AlertService } from "../../services/alert.service";
interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: "app-gestion-services",
  templateUrl: "./gestion-administrateur.component.html",
  styleUrls: ["./gestion-administrateur.component.css"],
})
export class GestionAdministrateurComponent implements OnInit {
  expandedRows: expandedRows = {};
  environments: any;
  skeleton: boolean = true;
  checkDetailsUsers: boolean = false;

  keyWord : string="";
  dataNumberShow: number= 10;
  offset:number=0;
  limit:number= this.dataNumberShow;
  currentPage=1;
  totalPages=0;

  users: any[] = [];
  detailUser = {
    first_name: "",
    last_name: "",
    registration_number: "",
    phone: "",
    is_admin: 1,
    is_valid: 1,
  };
  isAdmin = [
    { name: "Admin", value: 1 },
    { name: "Client", value: 0 },
  ];
  isValid = [
    { status: true, value: 1 },
    { status: false, value: 0 },
  ];
  checked: boolean = false;
  disableUpdate: boolean = false;
  userBody = {
    first_name: "",
    last_name: "",
    registration_number: "",
    email: "",
    phone: "",
    is_admin: 1,
    is_valid: 1,
    password: "",
    confirmPassword: "",
  };
  modalCreateUser: boolean = false;
  addContrat: boolean = false;
  contratBody = {
    title: "",
    creation_date:"",
    user_id: "",
  };

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private serviceService: ServiceService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private router: Router,
    private statusService : AlertService
  ) {}

  ngOnInit() {
    this.environments = environment;
    this.getAllAdmins();
  }

  showModalCreateUser() {
    this.clearForm();
    this.modalCreateUser = true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

  createUser() {

    if (!this.isValidEmail(this.userBody.email)) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Les mots de passe ne correspondent pas.",
      });
      return;
    }

    if (this.userBody.password !== this.userBody.confirmPassword) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Les mots de passe ne correspondent pas.",
      });
      return;
    }
    this.spinner.show("spinnerLoader");
    this.serviceService.registerAdmin(this.userBody).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Enregistré",
          detail: "Utilisateur enregistré avec succès",
        });
        this.getAllAdmins();
        this.modalCreateUser = false;
        this.clearForm();
        this.spinner.hide("spinnerLoader");
      },
      (error) => {
        let status = this.statusService.getStatus();
        this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
        this.spinner.hide("spinnerLoader");
      }
    );
    
  }

  clearForm() {
    this.userBody.first_name = "";
    this.userBody.last_name = "";
    this.userBody.registration_number = "";
    this.userBody.email = "";
    this.userBody.password = "";
    this.userBody.confirmPassword = "";
    this.userBody.is_admin = 1;
    this.userBody.phone = "";
    this.checked = false;
  }

  oneCheckAdmin(value: any) {
    const foundItem = this.isAdmin.find((item) => item.value === value);
    return foundItem ? foundItem.name : false;
  }

  oneCheckValid(value: any) {
    if (value) {
      this.detailUser.is_valid = 1;
    } else {
      this.detailUser.is_valid = 0;
    }
    const foundItem = this.isValid.find((item) => item.value === value);
    this.checked = foundItem.status;
  }

  searchAdmins(key)
  {
      this.keyWord=key;
      this.offset=0;
      this.limit= this.dataNumberShow;
      this.getAllAdmins();
      this.currentPage = 1
  }

  getPageNumbers(): void {
    const pageCount = Math.ceil(this.totalPages / this.dataNumberShow);
    this.totalPages=pageCount;
  }

  changePage(newPage: any) {
    if (newPage >= 1 && newPage <= this.totalPages) {

      this.currentPage=newPage;
      this.offset=(this.dataNumberShow*(newPage-1));
      this.limit= this.dataNumberShow;

    this.getAllAdmins();
    }
  }

  getAllAdmins() {
    const body = {
      key: this.keyWord,
      offset: this.offset,
      limit: this.limit
    }
    
    this.serviceService.getAllAdmins(body).subscribe((data: any) => {
      
      this.users = data.users;
      this.totalPages=data.userCount;
      this.getPageNumbers();
      this.skeleton = false;
    },
    (error) => {
      let status = this.statusService.getStatus();
      this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
    }
    );
  }

  getDEtailsUsers(id: any) {
    this.checkDetailsUsers = true;
    this.serviceService.getDetailsUsers(id).subscribe((data: any) => {
      this.detailUser = data.user;
      this.oneCheckValid(this.detailUser.is_valid);
    },
    (error)=>{
      let status = this.statusService.getStatus();
      this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
    }
    );
  }

  deleteUser(id: any, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Etes-vous sur de supprimer cet administrateur?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "Oui", 
      rejectLabel: "Non", 

      accept: () => {
        this.spinner.show("spinnerLoader");
        this.serviceService.deleteUsers(id).subscribe(() => {
          this.messageService.add({
            severity: "info",
            summary: "Confirmé",
            detail: "Administrateur supprimé",
          });
          this.getAllAdmins();
          this.spinner.hide("spinnerLoader");
        },
        (error)=>{
          let status = this.statusService.getStatus();
          this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
        }
        );
      },
      reject: () => {

      },
    });
  }

  updateUser() {
    this.disableUpdate = true;
    this.spinner.show("spinnerLoader");
    this.serviceService.updateUser(this.detailUser).subscribe(() => {
      this.getAllAdmins();
      this.checkDetailsUsers = false;
      this.disableUpdate = false;
      this.spinner.hide("spinnerLoader");
    },
    (error)=>{
      let status = this.statusService.getStatus();
      this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
      this.spinner.hide("spinnerLoader");
    }
    );
  }

  hideAjoutServicePopup() {
    this.checkDetailsUsers = false;
  }
}
