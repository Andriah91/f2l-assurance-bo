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
import { FormsModule } from "@angular/forms";
import { DropdownModule } from "primeng/dropdown";
interface expandedRows {
  [key: string]: boolean;
}
interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
  selector: "app-gestion-carte",
  templateUrl: "./gestion-carte.component.html",
  styleUrls: ["./gestion-carte.component.css"], 
})
export class GestionCarteComponent implements OnInit {
  expandedRows: expandedRows = {};
  environments: any;
  skeleton: boolean = true;
  checkDetailsCard: boolean = false;
  ajouterDoc: boolean = false;
  pathUrl: string;
   userCard: any;
   isVisible : boolean=true;
   userCardName : string ="";
   isDropdownDisabled = false;
   isFileUploaded:boolean=false;

   lastValisation:number=2;

  keyWord : string="";
  keyWordUser : string="";  

  dataNumberShow: number= 10;
  dataNumberShowUser:number=15;
  offset:number=0;
  offsetUser:number=0;
  limit:number= this.dataNumberShow;
  limitUser:number= this.dataNumberShowUser;
  currentPage=1;
  totalPages=0;
  f: any[] = [];

  users: any[] = [];
  selectedUser: any = null;

  usersDetails: any[] = [];
  selectedUserDetails: any = null;

  cartes: any[] = [];
  detailCarte = {
    id:0,
    titre: "",
    path: "", 
    first_name:"",
    is_active: 0, 
     message:"",
     title:"Status de la carte"
  }; 
  isValid = [
    { status: true, value: 1 },
    { status: false, value: 0 },
  ];
  isValidUpdate = [
    { status: true, value: 1 },
    { status: false, value: 0 },
  ];
  checked: boolean = false;
  disableUpdate: boolean = false;
  carteBody = {
    titre: "",
    path: "", 
    is_active:0,
    user_id:0
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
    if(localStorage.getItem("userCard")!=null){
        this.userCard = JSON.parse(localStorage.getItem('userCard') || '{}');   
        if(this.userCard.hasCard)
        {
          this.getDetailsCarte(this.userCard.cartes[0].id);
        }
        else{
          this.isVisible=false;
          this.userCardName="de "+this.userCard.first_name+" "+this.userCard.last_name ;
          this.users.push(this.userCard);  
          this.showModalCreateUser(); 
        }  
    } else{
      this.getAllUsers();
    }
   
    this.environments = environment;
    this.getAllCard();  

  }
  ngOnDestroy() { 
    localStorage.removeItem('userCard');
  }
  handleFilter(event: any) {
    this.keyWordUser=event.filter;
    this.offsetUser=0;
    this.limitUser= this.dataNumberShowUser;
    this.getAllUsers();
    this.currentPage = 1
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
          this.totalPages = data.userCount;
          this.getPageNumbers();
          this.skeleton = false;
         
     
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

  showModalCreateUser() {
    this.clearForm();
    this.isFileUploaded=false;
    this.modalCreateUser = true; 
    this.checked = false;
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
            detail: "Cette carte n'a pas d'image",
      });
      return;
    }
   window.open(this.pathUrl + url, "_blank");
}
openLink(event: MouseEvent,url: string)
{
  window.open(url, "_blank");
}
getFileUpload(event:UploadEvent) {
  if(event.files.length>1){
    this.messageService.add({
      severity: "error",
          summary: "",
          detail: "Vous ne pouvez sélectionner qu'un seul fichier.",
    });
    this.f = [];
    return;
  }
  for(let file of event.files) {
      this.f.push(file);
  }
 this.setFileDisabled();
} 
onCancel(){
  this.f = [];
  this.setFileDisabled();
}
removeFile(file: any) {
  const index = this.f.indexOf(file);
  if (index !== -1) {
    this.f.splice(index, 1);
  }
  this.setFileDisabled();
}
setFileDisabled(){
  if(this.f.length>=1){
    this.isFileUploaded=true;
  }else{
    this.isFileUploaded=false;
  } 
}
getDetailsCarte(id: any) { 
  this.lastValisation=2;
  this.checkDetailsCard = true;
  this.serviceService.getDetailsCard(id).subscribe((data: any) => { 
     this.usersDetails=[];
    this.usersDetails.push(data.carte.user);
    this.detailCarte = data.carte;  
    this.selectedUser=this.usersDetails[0];  
    this.checked = this.detailCarte.is_active=== 1;
    this.lastValisation=this.detailCarte.is_active;
  });
}  

getFilePath(file: string) {
  return file.split("public/filaka/")[1];
}
getFileType(file: string) {
  return file.split(".")[1];
}

openModal(id: any) {
  this.carteBody.titre = ""; 
}
isLink(link: string): boolean {
  if(link==null){
    return true
  }
  return link.startsWith('http://') || link.startsWith('https://');
}
getImageType(path:any)
{
    return path.split(".")[1];
}

onUploadUpdate() {  
  if (this.detailCarte.titre === "") {
    this.messageService.add({
      severity: "error",
          summary: "",
          detail: "Champ titre manquant",
    });
    return;
  }
  
  if (this.lastValisation != this.detailCarte.is_active) { 
      let messageValue = ["désactivé", "activé"];
      this.detailCarte.message="Votre carte tiers "+this.detailCarte.titre+" a été "+messageValue[this.detailCarte.is_active];
      this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "La carte sera " + messageValue[this.detailCarte.is_active],
      header: "Confirmer?",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text p-button-text",
      acceptIcon: "none",
      rejectIcon: "none",
      acceptLabel: "Oui",
      rejectLabel: "Non",
      accept: () => {
        if(this.f.length==0){
          this.disableUpdate = true;
          this.spinner.show("spinnerLoader"); 
          this.serviceService.cardStateNotification(this.detailCarte).subscribe(() => {
            this.getAllCard();
            this.checkDetailsCard = false;
            this.disableUpdate = false;
            this.spinner.hide("spinnerLoader");
            this.messageService.add({
              severity: "success",
              summary: "Carte modifiée avec succès",
              detail: "",
            });
          },
          (error) => {
            let status = this.statusService.getStatus();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: status });
            this.spinner.hide("spinnerLoader");
            return;
          });
        }else{
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
                    id:this.detailCarte.id,
                    titre: this.detailCarte.titre,
                    path: this.getFilePath(data.paths[index]), 
                    type: this.getImageType(this.getFilePath(data.paths[index])),
                    is_active:this.detailCarte.is_active,
                    message: this.detailCarte.message,
                    title: this.detailCarte.title, 
                  };
        
                  this.serviceService.cardStateNotification(body).subscribe(() => {
                    this.getAllCard();
                    this.f = [];
                    this.clearDetail();
                    this.checkDetailsCard = false;
                    this.disableUpdate = false;
                    this.messageService.add({
                      severity: "success",
                      summary: "Carte modifiée avec succès",
                      detail: "",
                    });
                    this.spinner.hide("spinnerLoader");
                  },
                  (error) => {
                    let status = this.statusService.getStatus();
                    this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
                    this.spinner.hide("spinnerLoader");
                    return;
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
       
       
      },
      reject: () => {
        return;
      },
      
    });
    
    
  } else {  
    if(this.f.length==0){
      this.disableUpdate = true;
      this.spinner.show("spinnerLoader");
      this.serviceService.cardStateNotification(this.detailCarte).subscribe(() => {
        this.getAllCard();
        this.checkDetailsCard = false;
        this.disableUpdate = false;
        this.spinner.hide("spinnerLoader");
        this.messageService.add({
          severity: "success",
          summary: "Carte modifiée avec succès",
          detail: "",
        });
      },
      (error) => {
        let status = this.statusService.getStatus();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: status });
        this.spinner.hide("spinnerLoader");
        return;
      });
    }else{
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
                id:this.detailCarte.id,
                titre: this.detailCarte.titre,
                path: this.getFilePath(data.paths[index]), 
                type: this.getImageType(this.getFilePath(data.paths[index])),
                is_active:this.detailCarte.is_active
              };
    
              this.serviceService.cardStateNotification(body).subscribe(() => {
                this.getAllCard();
                this.f = [];
                this.clearDetail();
                this.checkDetailsCard = false;
                this.disableUpdate = false;
                this.messageService.add({
                  severity: "success",
                  summary: "Carte modifiée avec succès",
                  detail: "",
                });
                this.spinner.hide("spinnerLoader");
              },
              (error) => {
                let status = this.statusService.getStatus();
                this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
                this.spinner.hide("spinnerLoader");
                return;
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
   
  

  } 


onUpload() {   
  
  if (this.carteBody.titre === "") {
    this.messageService.add({
      severity: "error",
          summary: "",
          detail: "Champ titre manquant",
    });
    return;
  }  

  if(this.userCard==null && this.selectedUser==null)
  {
    this.messageService.add({
      severity: "error",
          summary: "",
          detail: "Veuillez choisir un client",
    });
    return;
  } 

  if (this.f.length ==0 || this.f.length>1) {
    this.messageService.add({
      severity: "error",
          summary: "",
          detail: "Veuillez mettre une image",
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
          for (let index = 0; index < data.paths.length; index++) {
            var userId=0;
            if(this.userCard==null){
              userId= this.selectedUser.id;
            }else{
              userId=this.userCard.id;
            }
            var body = {
              titre: this.carteBody.titre,
              user_id:userId,
              path: this.getFilePath(data.paths[index]), 
              type: this.getImageType(this.getFilePath(data.paths[index])),
              is_active:this.carteBody.is_active
            };
  
            this.serviceService.cardStateNotification(body).subscribe(
              () => {
                this.getAllCard();
                this.f = [];
                this.ajouterDoc = false;
                this.spinner.hide("spinnerLoader");
                this.clearForm();
                this.modalCreateUser = false; 
                if(this.userCard!=null){
                   this.clearUserCard();
                }
              
                this.messageService.add({
                  severity: "success",
                  summary: "Carte ajoutée",
                  detail: "",
                });
                //this.router.navigate(['/manager/utilsateur']);
              },
              (error) => {
                let status = this.statusService.getStatus();
                this.messageService.add({ severity: 'error', summary: 'Error', detail:  JSON.stringify(status) });
                this.spinner.hide("spinnerLoader");
              }
            );
          }
        }
      },
      (error) => { 
        let status = this.statusService.getStatus();
        console.log("stataka"+status); 
        this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
      }
    );
  


} 
  confirmCloseDialog() {
    this.clearUserCard() ;
  } 

  clearForm() {
    this.selectedUser=null;
    this.isFileUploaded=false;
    this.carteBody.titre = ""; 
   this.carteBody.is_active = 0;
   this.detailCarte.is_active = 0;
  }

  clearUserCard()
  {
    this.carteBody.is_active = 0;
    this.userCard=null;
    localStorage.removeItem('userCard');
    this.isVisible=true;
    this.userCardName=""; 
    this.getAllUsers();
  }

  clearDetail() {
    this.selectedUser=null;
    this.detailCarte.titre = ""; 
   this.detailCarte.is_active = 0;
   this.isFileUploaded=false;
  }

  searchCard(key)
  {
      this.keyWord=key;
      this.offset=0;
      this.limit= this.dataNumberShow;
      this.getAllCard();
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

    this.getAllCard();
    }
  }

  getAllCard() {
    const body = {
      key: this.keyWord,
      offset: this.offset,
      limit: this.limit
    }
    
    this.serviceService.getAllCartes(body).subscribe((data: any) => { 
      this.cartes = data.cartes;
      this.totalPages=data.carteCount;
      this.getPageNumbers();
      this.skeleton = false;
    },
    (error) => { 
      let status = this.statusService.getStatus(); 
      this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
     
    }
    );
  }
  oneCheckValid(value: any) {
    if (value) {
      this.carteBody.is_active = 1;
     
    } else {
      this.carteBody.is_active = 0;
    }
    const foundItem = this.isValid.find((item) => item.value === value);
    this.checked = foundItem.status;
  }

  oneCheckValidUpdate(value: any) {
    if (value) {
      this.detailCarte.is_active = 1;
     
    } else {
      this.detailCarte.is_active = 0;
    }
    const foundItem = this.isValidUpdate.find((item) => item.value === value);
    this.checked = foundItem.status;
  }
  
  deleteCard(id: any, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Etes-vous sur de supprimer cette carte?",
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
        this.serviceService.deleteCard(id).subscribe(() => {
          this.messageService.add({
            severity: "info",
            summary: "Confirmé",
            detail: "Carte supprimée",
          });
          this.getAllCard();
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
    this.checkDetailsCard = false;
  }
}
