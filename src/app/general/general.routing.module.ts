import { Routes, RouterModule } from '@angular/router';
import { GeneralComponent } from './general.component';
import { NgModule } from '@angular/core';

const routes: Routes = [
  {
    path: '',
    component: GeneralComponent,
    children: [
      // {
      //   path: 'home', // child route path
      //   component: HomeComponent, // child route component that the router renders
      // },
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      { path: '**', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GeneralRoutes { }
