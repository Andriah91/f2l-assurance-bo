import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService, PrimeNGConfig } from "primeng/api";
import { ServiceService } from "../../services/service.service";
import { environment } from "src/environments/environment";
import { DatePipe } from "@angular/common";
import { CalendarModule } from 'primeng/calendar';
import { AlertService } from "../../services/alert.service";
import { NgxSpinnerService } from "ngx-spinner";


interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: "app-gestion-contrat",
  templateUrl: "./gestion-contrat.component.html",
  styleUrls: ["./gestion-contrat.component.scss"],
})
export class GestionPersonnelComponent implements OnInit {
  environments: any;
  skeleton: boolean = true;
  titre: string = "";
  idContrat: any;
  pathUrl: string;

  users: any[] = [];
  disableUpdate: boolean = false;

  contratList: any[] = [];
  ajouterDoc: boolean = false;
  uploadedFiles: any[] = [];
  f: any[] = [];
  detailsContrat: boolean = false;
  bodyContrat = {
    id: "",
    title: "",
    creation_date: "",
    user_id: "",
  };
  checkAddContrat: boolean = false;
  create = {
    title: "",
    creation_date: "",
    user_id: "",
  }

  contratBody = {
    title: "",
    creation_date:"",
    user_id: "",
  };
  idUser: any ;
  nameUser: string = "";

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private serviceService: ServiceService,
    private datePipe: DatePipe,
    private statusService : AlertService,
    private spinner: NgxSpinnerService,
  ) {
    this.pathUrl = environment.PATH_URL;
  }

  ngOnInit() {
    this.environments = environment;
    this.idUser = localStorage.getItem('userId');
    this.nameUser = localStorage.getItem('clientId');
    this.getAllContrat();
  }

  deleteDocument(id: any, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Etes-vous sur de supprimer ce document?",
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
        this.serviceService.deletedoc(id).subscribe(() => {
          this.messageService.add({
            severity: "info",
            summary: "Confirmé",
            detail: "Document supprimé",
          });
          this.spinner.hide("spinnerLoader");
          this.getAllContrat();
        },
        (error: any) => {
          let status = this.statusService.getStatus();
          this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
          this.spinner.hide("spinnerLoader");
        }
        );
      },
      reject: () => {
      
      },
    });
  }

  showModalCreateContrat() {
    this.checkAddContrat = true;
  }

  getAllContrat() {
    this.serviceService.getAllContrat(this.idUser).subscribe((data: any) => {
      this.contratList = data.contrats;
      this.skeleton = false;
    });
  }

  openUrl(event: MouseEvent,url: string) {
    event.preventDefault(); 
    window.open(this.pathUrl + url, "_blank");
  }

  showDetailsContrat(data: any) {
    this.bodyContrat = data;
    this.detailsContrat = true;
  }

  openAddContrat() {
    this.contratBody = {
      title: "",
      creation_date: "",
      user_id: this.idUser,
    };
    this.checkAddContrat = true;
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

    this.spinner.show("spinnerLoader");
    this.serviceService.registerContrat(this.contratBody).subscribe(() => {
     
      this.getAllContrat();
      this.contratBody = {
        title: "",
        creation_date: "",
        user_id: "",
      };
      this.checkAddContrat = false;
      this.spinner.hide("spinnerLoader");
      this.messageService.add({
        severity: "success",
        summary: "Enregistré",
        detail: "Contrat créé avec success",
      });
     
    },  (error: any) => {
      let status = this.statusService.getStatus();
      this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
      this.spinner.hide("spinnerLoader");
      }
      );
  }
  updateContrat() {
    this.disableUpdate = true;
    this.spinner.show("spinnerLoader");
    this.serviceService.updateContrat(this.bodyContrat).subscribe(() => {
      this.messageService.add({
        severity: "success",
        summary: "Confirmé",
        detail: "Contrat modifié",
      });
      this.spinner.hide("spinnerLoader");
      this.detailsContrat = false;
      this.disableUpdate = false;
      },  (error: any) => {
      let status = this.statusService.getStatus();
      this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
      this.spinner.hide("spinnerLoader");
      }
      );
  }

  deleteContrats(id: any, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Etes-vous sur de supprimer ce contrat?",
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
        this.serviceService.deleteContrat(id).subscribe(() => {
          this.messageService.add({
            severity: "info",
            summary: "Confirmé",
            detail: "Contrat supprimé",
          });
          this.spinner.hide("spinnerLoader");
          this.getAllContrat();
        },
        (error: any) => {
          let status = this.statusService.getStatus();
          this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
          this.spinner.hide("spinnerLoader");
          }
        );
      },
      reject: () => {
       
      },
    });
  }

  getFileUpload(event:UploadEvent) {
    for(let file of event.files) {
        this.f.push(file);
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
    this.idContrat = id;
    this.titre = "";
    this.ajouterDoc = true;
  }

  onUpload() {
    if (this.titre === "" || this.f.length === 0) {
      this.messageService.add({
        severity: "error",
            summary: "",
            detail: "Champ titre ou fichier manquant",
      });
      return;
    }
    const uploadData = new FormData();
    for (let i = 0; i < this.f.length; i++) {
      uploadData.append("fichier[]", this.f[i], this.f[i].name);
    }
    this.spinner.show("spinnerLoader");
    this.serviceService.upload(uploadData).subscribe(
      (data) => {
        if (data.message === "success") {
          console.log("data.paths" + data.paths);
          for (let index = 0; index < data.paths.length; index++) {
            var body = {
              titre: this.titre,
              path: this.getFilePath(data.paths[index]),
              type: this.getFileType(data.paths[index]),
              contrat_id: this.idContrat,
              message:"Ajout du document "+ this.titre+" dans votre contrat"
            };

          //  this.serviceService.createDocument(body).subscribe(
            this.serviceService.fileStateNotification(body).subscribe(
              () => {
                this.getAllContrat();
                this.f = [];
                this.ajouterDoc = false;
                this.spinner.hide("spinnerLoader");
                this.messageService.add({
                  severity: "success",
                  summary: "File Uploaded",
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
         // console.log(data.paths, "paths");
        }
      },
      (error) => {
        let status = this.statusService.getStatus();
        this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
      }
    );
  }
}
