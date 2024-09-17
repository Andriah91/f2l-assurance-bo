import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { ServiceService } from "../../services/service.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from "../../services/alert.service";

interface Carte {
  id: string;
  clientName: string;
  imageUrl: string;
}

@Component({
  selector: "app-gestion-cartetiers",
  templateUrl: "./gestion-cartetiers.component.html",
  styleUrls: ["./gestion-cartetiers.component.scss"],
})
export class GestionCartetiersComponent implements OnInit {
  cartes: Carte[] = [];
  ajouterCarte: boolean = false;
  selectedClient: string = "";
  uploadedFiles: any[] = [];
  skeleton: boolean = true; // Assurez-vous que la propriété skeleton est définie

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private serviceService: ServiceService,
    private spinner: NgxSpinnerService,
    private statusService: AlertService
  ) {}

  ngOnInit() {
    this.getAllCartes();
  }

  // Méthode pour récupérer toutes les cartes
  getAllCartes() {
    this.serviceService.getAllCartes().subscribe((data: any) => {
      this.cartes = data.cartes;
      this.skeleton = false;
    });
  }

  // Méthode pour gérer les fichiers téléchargés
  getFileUpload(event: any) {
    this.uploadedFiles = event.files;
  }

  openAddCarte() {
    this.selectedClient = "";
    this.uploadedFiles = [];
    this.ajouterCarte = true;
  }

  addCarte() {
    if (!this.selectedClient || this.uploadedFiles.length === 0) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Veuillez sélectionner un client et importer une image",
      });
      return;
    }

    const uploadData = new FormData();
    this.uploadedFiles.forEach(file => {
      uploadData.append("image", file, file.name);
    });

    this.spinner.show("spinnerLoader");
    this.serviceService.uploadCarteImage(uploadData).subscribe(
      (response) => {
        const newCarte = {
          clientName: this.selectedClient,
          imageUrl: response.path, // Assurez-vous que l'API retourne le chemin de l'image
        };

        this.serviceService.createCarte(newCarte).subscribe(() => {
          this.getAllCartes();
          this.ajouterCarte = false;
          this.messageService.add({
            severity: "success",
            summary: "Succès",
            detail: "Carte ajoutée avec succès",
          });
          this.spinner.hide("spinnerLoader");
        });
      },
      (error) => {
        let status = this.statusService.getStatus();
        this.messageService.add({ severity: 'error', summary: 'Error', detail: status });
        this.spinner.hide("spinnerLoader");
      }
    );
  }

  deleteCarte(id: string, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Êtes-vous sûr de vouloir supprimer cette carte?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.spinner.show("spinnerLoader");
        this.serviceService.deleteCarte(id).subscribe(() => {
          this.messageService.add({
            severity: "info",
            summary: "Confirmé",
            detail: "Carte supprimée",
          });
          this.spinner.hide("spinnerLoader");
          this.getAllCartes();
        });
      },
      reject: () => {},
    });
  }

  editCarte(carte: Carte) {
    // Logique d'édition de la carte ici
    console.log("Edit carte", carte);
  }
}
