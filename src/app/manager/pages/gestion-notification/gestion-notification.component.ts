import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { ConfirmationService, MessageService } from "primeng/api";
import { ServiceService } from "../../services/service.service";
import { NgxSpinnerService } from "ngx-spinner";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { AlertService } from "../../services/alert.service";
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FileUploadModule } from 'primeng/fileupload';
interface expandedRows {
  [key: string]: boolean;
}
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: "app-gestion-notification",
  templateUrl: "./gestion-notification.component.html",
  styleUrls: ["./gestion-notification.component.css"],
})
export class GestionNotificationComponent implements OnInit {
  expandedRows: expandedRows = {};
  environments: any;
  skeleton: boolean = true;
  checkDetailsUsers: boolean = false;
  ajouterDoc: boolean = false;
  pathUrl: string;

  keyWord : string="";
  dataNumberShow: number= 10;
  offset:number=0;
  limit:number= this.dataNumberShow;
  currentPage=1;
  totalPages=0;
  f: any[] = [];

  keyWordUser : string="";
  offsetUser:number=0;
  limitUser:number= this.dataNumberShow;

  sendingType!: string;
  isVisible: boolean=false;
  users: any[] = []; 
  selectedUsers: any[] = []; 

  notifs: any[] = [];
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
  notifBody = {
    title: "",
    message: "",
    path: ""
  };
  modalCreateUser: boolean = false;
  addContrat: boolean = false;
 
  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private serviceService: ServiceService,
    private spinner: NgxSpinnerService,
    private datePipe: DatePipe,
    private router: Router,
    private statusService : AlertService
  ) {
    this.pathUrl = environment.PATH_URL;
  }

  ngOnInit() {
    this.environments = environment;
    this.getAllNotifications();
    this.getAllUsers();
  }

  getAllUsers() {
    try {
      const body = {
        key: this.keyWordUser,
        offset: this.offsetUser,
        limit: this.limitUser
      };

      this.serviceService.getAllUsers(body).subscribe(
        (data: any) => {
          this.users = data.users; 
        },
        (error) => {
          let status = this.statusService.getStatus();
          this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
          return;
        }
      );
    } catch (error) {
        console.log(error);
    }
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

  showModalCreateUser() {
    this.clearForm();
    this.modalCreateUser = true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

openUrl(event: MouseEvent,url: string) {
  event.preventDefault(); 
  if(url=="path")
    {
      this.messageService.add({
        severity: "error",
            summary: "",
            detail: "Cette notification n'a pas d'image",
      });
      return;
    }
   window.open(this.pathUrl + url, "_blank");
}
getFileUpload(event:UploadEvent) {
  for(let file of event.files) {
      this.f.push(file);
  }
}
onChoiceChange(choice: string) { 
  if(choice=="all"){
    this.isVisible=false;
  }else{
    this.isVisible=true;
  }
}


removeFile(file: any) {
  const index = this.f.indexOf(file);
  if (index !== -1) {
    this.f.splice(index, 1);
  }
}

getFilePath(file: string) {
  return file.split("public/filaka/")[1];
}
getFileType(file: string) {
  return file.split(".")[1];
}

openModal(id: any) {
  this.notifBody.message = "";
  this.notifBody.title = "";
}

onUpload() {     
  if (this.notifBody.title === "" || this.notifBody.message === "") {
    this.messageService.add({
      severity: "error",
          summary: "",
          detail: "Champ titre ou message ou fichier manquant",
    });
    return;
  }
  if(this.sendingType === undefined || this.selectedUsers.length==0) {
      this.messageService.add({
        severity: "error",
            summary: "",
            detail: "A qui vous voulez envoyer la notification?",
      });
  } 
  if (this.f.length >1) {
    this.messageService.add({
      severity: "error",
          summary: "",
          detail: "Mettez une seule image",
    });
    return;
  }
  if(this.f.length==0)
  {
    var body = {
      title: this.notifBody.title,
      path: "path",
      message: this.notifBody.message,
      insert: true
    };
    this.serviceService.registerNotification(body).subscribe(
      () => {
        this.getAllNotifications();
        this.f = [];
        this.ajouterDoc = false;
        this.spinner.hide("spinnerLoader");
        this.modalCreateUser = false;
        this.messageService.add({
          severity: "success",
          summary: "Notification ajoutée",
          detail: "",
        });
      },
      (error) => {
        let status = this.statusService.getStatus();
        this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
        this.spinner.hide("spinnerLoader");
      }
    );
  }
  else{

    const uploadData = new FormData();
    for (let i = 0; i < this.f.length; i++) {
      uploadData.append("fichier[]", this.f[i], this.f[i].name);
    }
  
    this.spinner.show("spinnerLoader");
    this.serviceService.upload(uploadData).subscribe(
      (data) => {
        if (data.message === "success") {
          for (let index = 0; index < data.paths.length; index++) {
            var body = {
              title: this.notifBody.title,
              path: this.getFilePath(data.paths[index]),
              message: this.notifBody.message,
              insert:true
            };
  
            this.serviceService.registerNotification(body).subscribe(
              () => {
                this.getAllNotifications();
                this.f = [];
                this.ajouterDoc = false;
                this.spinner.hide("spinnerLoader");
                this.modalCreateUser = false;
                this.messageService.add({
                  severity: "success",
                  summary: "Notification ajoutée",
                  detail: "",
                });
              },
              (error) => {
                let status = this.statusService.getStatus();
                this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
                this.spinner.hide("spinnerLoader");
              }
            );
          }
        }
      },
      (error) => {
        let status = this.statusService.getStatus();
        this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
      }
    );
  }


}


  clearForm() {
    this.notifBody.message = "";
    this.notifBody.title = "";
    this.notifBody.path = "";
  }

  searchNotifications(key)
  {
      this.keyWord=key;
      this.offset=0;
      this.limit= this.dataNumberShow;
      this.getAllNotifications();
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

    this.getAllNotifications();
    }
  }

  getAllNotifications() {
    const body = {
      key: this.keyWord,
      offset: this.offset,
      limit: this.limit
    }
    
    this.serviceService.getAllNotifications(body).subscribe((data: any) => {
      
      this.notifs = data.notifs;
      this.totalPages=data.notifCount;
      this.getPageNumbers();
      this.skeleton = false;
    },
    (error) => {
      let status = this.statusService.getStatus();
      this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
    }
    );
  }

  deleteNotification(id: any, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Etes-vous sur de supprimer cette notification?",
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
        this.serviceService.deleteNotification(id).subscribe(() => {
          this.messageService.add({
            severity: "info",
            summary: "Confirmé",
            detail: "Notification supprimée",
          });
          this.getAllNotifications();
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

  hideAjoutServicePopup() {
    this.checkDetailsUsers = false;
  }
}
