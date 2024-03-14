import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './manager/guard/auth.guard';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'manager',
        pathMatch: 'full',
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./auth/auth.module').then((m) => m.AuthModule),
    },
    {
        canActivate: [AuthGuard],
        path: 'manager',
        loadChildren: () =>
            import('./manager/manager.module').then((m) => m.ManagerModule),
    },
    {
        path: '**',
        redirectTo: 'manager',
    },
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
