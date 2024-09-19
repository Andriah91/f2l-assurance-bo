import { Component, OnInit } from "@angular/core";
import { ConfirmationService, MessageService } from "primeng/api";
import { ServiceService } from "../../services/service.service"; // Nom du service inchangé
import { NgxSpinnerService } from "ngx-spinner";
import { AlertService } from "../../services/alert.service";

interface Client {
  id?: number; // Le champ 'id' est facultatif car il peut être null
  first_name?: string;
  last_name?: string;
}

interface Carte {
  id: number;
  titre: string;
  path: string;
  is_active: number;
  client_id: {
    name_client: string | null; // 'name_client' peut être null
  };
  created_at: string;
  updated_at: string | null;
  deleted_at: string | null;
  client?: Client | null; // 'client' peut être null ou absent
}

@Component({
  selector: "app-gestion-cartetiers",
  templateUrl: "./gestion-cartetiers.component.html",
  styleUrls: ["./gestion-cartetiers.component.scss"],
})
export class GestionCartetiersComponent implements OnInit {
  modalCreateCarte: boolean = false;
  cartes: Carte[] = [];
  ajouterCarte: boolean = false;
  isEditMode: boolean = false;
  selectedClientId: number = 0;
  uploadedFiles: File[] = [];
  selectedCarte: Carte | null = null;
  skeleton: boolean = true;
  keyWord: string = ''; // Ajout du mot-clé de recherche

  constructor(
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private serviceService: ServiceService, // Correctement nommé
    private spinner: NgxSpinnerService,
    private statusService: AlertService
  ) {}

  ngOnInit(): void {
    this.getCartes();
  }

  // Méthode pour récupérer les cartes depuis l'API searchcartes
  getCartes() {
    this.spinner.show("spinnerLoader");

    // Paramètres de la requête
    const params = {
      key: this.keyWord || '', // Mot-clé de recherche, vide si non renseigné
      offset: 0, // Début de la pagination
      limit: 10 // Nombre de cartes à récupérer
    };

    this.serviceService.searchCartes(params).subscribe( // Correction ici
      (data: any) => {
        console.log('Cartes reçues:', data); // Vérifiez les données dans la console
        this.cartes = data.pubs || []; // Assurez-vous que 'data.pubs' contient bien les cartes
        this.skeleton = false;
        this.spinner.hide("spinnerLoader");
      },
      (error) => {
        console.error('Erreur lors de la récupération des cartes:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Erreur',
          detail: 'Erreur lors de la récupération des cartes.'
        });
        this.skeleton = false;
        this.spinner.hide("spinnerLoader");
      }
    );
  }

  // Gestion de l'upload des fichiers
  getFileUpload(event: any) {
    this.uploadedFiles = event.files;
  }

  // Ouvrir le formulaire pour ajouter une nouvelle carte
  openAddCarte() {
    this.isEditMode = false;
    this.selectedClientId = 0;
    this.uploadedFiles = [];
    this.ajouterCarte = true;
  }

  // Ajouter une nouvelle carte
  addCarte() {
    if (!this.selectedClientId || this.uploadedFiles.length === 0) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Veuillez sélectionner un client et importer une image.",
      });
      return;
    }

    const uploadData = new FormData();
    this.uploadedFiles.forEach((file) => {
      uploadData.append("image", file, file.name);
    });

    this.spinner.show("spinnerLoader");
    this.serviceService.uploadCarteImage(uploadData).subscribe(
      (response: any) => {
        const newCarte = {
          client_id: this.selectedClientId, // Assurez-vous que c'est l'ID du client
          titre: "Niveau 1", // Exemple de niveau, ajustez si nécessaire
          path: response.path,
          is_active: 1, // Correction ici, mettre 1 au lieu de true pour correspondre au type attendu
        };

        this.serviceService.createCarte(newCarte).subscribe(
          () => {
            this.getCartes(); // Correction ici, utiliser getCartes() à la place de getAllCartes()
            this.ajouterCarte = false;
            this.messageService.add({
              severity: "success",
              summary: "Succès",
              detail: "Carte ajoutée avec succès",
            });
            this.spinner.hide("spinnerLoader");
          },
          (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Erreur",
              detail: "Erreur lors de l'ajout de la carte.",
            });
            this.spinner.hide("spinnerLoader");
          }
        );
      },
      (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Erreur lors du téléchargement de l'image.",
        });
        this.spinner.hide("spinnerLoader");
      }
    );
  }

  // Ouvrir le formulaire pour modifier une carte
  openEditCarte(carte: Carte) {
    this.isEditMode = true;
    this.selectedCarte = carte;
    this.selectedClientId = carte.client?.id || 0; // Assurez-vous que c'est un numéro
    this.uploadedFiles = [];
    this.ajouterCarte = true;
  }

  // Mettre à jour une carte existante
  updateCarte() {
    if (!this.selectedCarte || !this.selectedClientId) {
      this.messageService.add({
        severity: "error",
        summary: "Erreur",
        detail: "Veuillez sélectionner un client et importer une image.",
      });
      return;
    }

    const updatedCarte = {
      ...this.selectedCarte,
      client_id: this.selectedClientId,
    };

    this.spinner.show("spinnerLoader");
    this.serviceService.updateCarte(updatedCarte).subscribe(
      () => {
        this.getCartes(); // Correction ici, utiliser getCartes() à la place de getAllCartes()
        this.ajouterCarte = false;
        this.messageService.add({
          severity: "success",
          summary: "Succès",
          detail: "Carte modifiée avec succès",
        });
        this.spinner.hide("spinnerLoader");
      },
      (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Erreur",
          detail: "Erreur lors de la modification de la carte.",
        });
        this.spinner.hide("spinnerLoader");
      }
    );
  }

  // Supprimer une carte
  deleteCarte(id: number, event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: "Êtes-vous sûr de vouloir supprimer cette carte?",
      header: "Confirmation",
      icon: "pi pi-info-circle",
      acceptButtonStyleClass: "p-button-danger p-button-text",
      rejectButtonStyleClass: "p-button-text",
      accept: () => {
        this.spinner.show("spinnerLoader");
        this.serviceService.deleteCarte(id).subscribe(
          () => {
            this.getCartes(); // Correction ici, utiliser getCartes() à la place de getAllCartes()
            this.messageService.add({
              severity: "info",
              summary: "Confirmé",
              detail: "Carte supprimée",
            });
            this.spinner.hide("spinnerLoader");
          },
          (error) => {
            this.messageService.add({
              severity: "error",
              summary: "Erreur",
              detail: "Erreur lors de la suppression de la carte.",
            });
            this.spinner.hide("spinnerLoader");
          }
        );
      },
    });
  }
}
