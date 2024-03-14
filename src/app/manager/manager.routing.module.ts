import { Routes, RouterModule } from "@angular/router";
import { ManagerComponent } from "./manager.component";
import { GestionPersonnelComponent } from "./pages/gestion-contrat/gestion-contrat.component";
import { GestionServicesComponent } from "./pages/gestion-utilisateur/gestion-utilisateur.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
  {
    path: "",
    component: ManagerComponent,
    children: [
      {
        path: "contrat", // child route path
        component: GestionPersonnelComponent, // child route component that the router renders
      },
      {
        path: "utilsateur", // child route path
        component: GestionServicesComponent, // child route component that the router renders
      },
      {
        path: "",
        redirectTo: "utilsateur",
        pathMatch: "full",
      },
      { path: "**", redirectTo: "utilsateur", pathMatch: "full" },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagerRoutes {}
