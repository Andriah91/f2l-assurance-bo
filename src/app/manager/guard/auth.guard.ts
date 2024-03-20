import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ServiceService } from '../services/service.service';
@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    constructor(
        private userService: ServiceService,
        private cookieService: CookieService,
        private router: Router
    ) {}
    canActivate(): boolean {
        let user = this.userService.findUser();
        
        if (user && user.is_admin == 1) {
        //if (user) {
            return true;
        } else {
            this.router.navigate(['/auth/login']);
            return false;
        }
    }
}
