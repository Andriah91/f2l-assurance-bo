import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { ConfirmationService, MessageService, PrimeNGConfig } from "primeng/api";
import { ServiceService } from "../../services/service.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
interface expandedRows {
  [key: string]: boolean;
}

@Component({
  selector: "app-gestion-services",
  templateUrl: "./gestion-utilisateur.component.html",
  styleUrls: ["./gestion-utilisateur.component.css"],
})
export class GestionServicesComponent implements OnInit {
  expandedRows: expandedRows = {};
  environments: any;
  skeleton: boolean = true;
  checkDetailsUsers: boolean = false;

  keyWord : string="";
  dataNumberShow: number= 2;
  offset:number=0;
  limit:number= this.dataNumberShow;
  currentPage=1;
  totalPages=0;

  users: any[] = [];
  detailUser = {
    first_name: "",
    last_name: "",
    registration_number: "",
    email: "",
    phone: "",
    is_admin: "",
    is_valid: 0,
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
    is_admin: 0,
    is_valid: 0
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
    private primengConfig: PrimeNGConfig
  ) {}

  ngOnInit() {
    this.environments = environment;
    this.getAllUsers();

    this.primengConfig.setTranslation({
      monthNames: [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
      ],
      dayNamesMin: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    });
  }

  openAddContrat(id: any) {
    this.contratBody = {
      title: "",
      creation_date: "",
      user_id: id,
    };
    this.addContrat = true;
  }

  showModalCreateUser() {
    this.clearForm();
    this.modalCreateUser = true;
  }

  createContrat() {
    if(this.contratBody.creation_date=="" || this.contratBody.title=="")
    {
      this.messageService.add({
        severity: "error",
        summary: "",
        detail: "Veuillez completer tous les champs",
      });
      return;
    }
    const formattedDate = this.datePipe.transform(this.contratBody.creation_date, 'yyyy-MM-dd');
    this.contratBody.creation_date = formattedDate;

    this.serviceService.registerContrat(this.contratBody).subscribe(() => {
      this.messageService.add({
        severity: "success",
        summary: "Enregistré",
        detail: "Contrat créé avec success",
      });
      this.getAllUsers();
      this.contratBody = {
        title: "",
        creation_date: "",
        user_id: "",
      };
      this.addContrat = false;
    });
  }

  deleteContrat(id: any, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Etes vous sur de supprimer ce contrat?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "Oui", 
      rejectLabel: "Non",

      accept: () => {
        this.spinner.show("deletecontrat");
        this.serviceService.deleteContrat(id).subscribe(() => {
          this.messageService.add({
            severity: "info",
            summary: "Confirmé",
            detail: "Contrat supprimé",
          });
          this.getAllUsers();
          this.spinner.hide("deletecontrat");
        });
      },
      reject: () => {
    
        this.spinner.hide("deletecontrat");
      },
    });
  }

   isValidPhoneNumber(numero: string): boolean {
    const regex = /^\d{9}$/;
    return regex.test(numero);
  }
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

  createUser() {
    if ((!this.isValidPhoneNumber(this.userBody.phone))||(!this.isValidEmail(this.userBody.email))) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Format de numéro de téléphone ou email invalide",
      });
      return;
    }
    this.userBody.phone="+33"+this.userBody.phone;

    this.serviceService.registerUser(this.userBody).subscribe(
      (response: any) => {
        this.messageService.add({
          severity: "success",
          summary: "Enregistré",
          detail: "Client enregistré avec success",
        });
        this.getAllUsers();
        this.modalCreateUser = false;
        this.clearForm();
      },
      (response: any) => {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: response.error.error,
        });
      }
    );
   
  }

  clearForm() {
    this.userBody.first_name = "";
    this.userBody.last_name = "";
    this.userBody.registration_number = "";
    this.userBody.email = "";
    this.userBody.is_admin = 0;
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

  searchUsers(key)
  {
      this.keyWord=key;
      this.offset=0;
      this.limit= this.dataNumberShow;
      this.getAllUsers();
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

    this.getAllUsers();
    }
  }

  getAllUsers() {
    try {
      const body = {
        key: this.keyWord,
        offset: this.offset,
        limit: this.limit
      };
  
      this.serviceService.getAllUsers(body).subscribe((data: any) => {
        this.users = data.users;
        this.totalPages = data.userCount;
        this.getPageNumbers();
        this.skeleton = false;
      });
    } catch (error) {
      console.error('Une erreur est survenue ', error);
    }
  }
  

  getDEtailsUsers(id: any) {
    this.checkDetailsUsers = true;
    this.serviceService.getDetailsUsers(id).subscribe((data: any) => {
      this.detailUser = data.user;
      this.detailUser.phone= this.detailUser.phone.slice(3);
      console.log(this.detailUser);
    });
  }

  deleteUser(id: any, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Etes-vous sur de supprimer cet utilisateur?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "Oui", 
      rejectLabel: "Non", 

      accept: () => {
        this.spinner.show("deleteuser");
        this.serviceService.deleteUsers(id).subscribe(() => {
          this.messageService.add({
            severity: "info",
            summary: "Confirmé",
            detail: "Utilisateur supprimé",
          });
          this.getAllUsers();
          this.spinner.hide("deleteuser");
        });
      },
      reject: () => {

      },
    });
  }

  updateUser() {
    this.disableUpdate = true;
    this.detailUser.phone="+33"+this.detailUser.phone;

    this.serviceService.updateUser(this.detailUser).subscribe(() => {
      this.getAllUsers();
      this.checkDetailsUsers = false;
      this.disableUpdate = false;
    });
  }

  hideAjoutServicePopup() {
    this.checkDetailsUsers = false;
  }

  navigateContrat(id: number,clientName:string) {
    localStorage.setItem('userId', id.toString());
    localStorage.setItem('clientId',clientName);
    this.router.navigate(['/manager/contrat']);
  }
}
