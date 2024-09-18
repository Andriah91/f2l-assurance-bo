import { MenuItem } from "./menuItem";

export class Menu {
  static menuEmploye: MenuItem[] = [
    {
      label: 'Gestion Rendez Vous',
      routerLink: '/employe/gestionRendezVous',
      icon: 'bi bi-journal-text',
    },
    {
      label: 'Gestion des Tâches',
      routerLink: '/employe/gestionTache',
      icon: 'bi bi-journal-text',
    },
    {
      label: 'Profil et Horaire de travail',
      routerLink: '/employe/profileHoraire',
      icon: 'bi bi-journal-text',
    },
    {
      label: ' Carte tiers',
      routerLink: '/employe/cartes',
      icon: 'bi bi-journal-text',
    }
  ];

  static menuManager: MenuItem[] = [
    {
      label: 'Gestion Personnel',
      routerLink: '/manager/ListRepportage',
      icon: 'bi bi-layout-text-window-reverse',
    }
  ];
}
