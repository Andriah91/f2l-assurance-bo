import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService, PrimeNGConfig } from "primeng/api";
import { ServiceService } from "../../services/service.service";
import { environment } from "src/environments/environment";
import { DatePipe } from "@angular/common";
import { CalendarModule } from 'primeng/calendar';


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
  idUser: number = 1;
  nameUser: string = "";

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private serviceService: ServiceService,
    private datePipe: DatePipe
  ) {
    this.pathUrl = environment.PATH_URL;
  }

  

  ngOnInit() {
    this.environments = environment;
    this.idUser = parseInt(localStorage.getItem('userId'));
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
        this.serviceService.deletedoc(id).subscribe(() => {
          this.messageService.add({
            severity: "info",
            summary: "Confirmé",
            detail: "Document supprimé",
          });
          this.getAllContrat();
        });
      },
      reject: () => {
      
      },
    });
  }

  showModalCreateContact() {
    this.checkAddContrat = true;
  }

  createContrat() {
    const formattedDate = this.datePipe.transform(this.create.creation_date, 'yyyy-MM-dd');
    this.create.creation_date = formattedDate;
    this.serviceService.registerContrat(this.create).subscribe(()=>{
      this.messageService.add({
        severity: "success",
        summary: "Confirmé",
        detail: "Contrat modifié",
      });
      this.getAllContrat();
      this.checkAddContrat = false;
    })
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

  updateContrat() {
    this.disableUpdate = true;
    this.serviceService.updateContrat(this.bodyContrat).subscribe(() => {
      this.messageService.add({
        severity: "success",
        summary: "Confirmé",
        detail: "Contrat modifié",
      });
      this.detailsContrat = false;
      this.disableUpdate = false;
    });
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

      accept: () => {
        this.serviceService.deleteContrat(id).subscribe(() => {
          this.messageService.add({
            severity: "info",
            summary: "Confirmé",
            detail: "Contrat supprimé",
          });
          this.getAllContrat();
        });
      },
      reject: () => {
       
      },
    });
  }

  getFileUpload(event:UploadEvent) {
    console.log(event, 'event');
    
    for(let file of event.files) {
        this.f.push(file);
    }
}

  //getFileUpload(event: any) {
    //this.f = event.currentFiles;
  //}

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
    const uploadData = new FormData();
    for (let i = 0; i < this.f.length; i++) {
      uploadData.append("fichier[]", this.f[i], this.f[i].name);
    }

    console.log(uploadData, "this.uploadedFiles");
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
            };
            this.serviceService.createDocument(body).subscribe({});
          }
          this.getAllContrat();
          this.f = [];
          this.ajouterDoc = false;
          this.messageService.add({
            severity: "success",
            summary: "File Uploaded",
            detail: "",
          });
          
          console.log(data.paths, "paths");
        }
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
