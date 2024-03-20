import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { LayoutService } from 'src/app/general/service/app.layout.service';
import { ServiceService } from 'src/app/manager/services/service.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent implements OnInit {
    user: any;
    username: string = '';
    token: any;
    checkToken: boolean = false;
    disabledlogin: boolean = false;
    sessionTimeout: any;
    url: any;
    valCheck: string[] = ['remember'];
    password!: string;
    msgs: Message[] = [];
    errorMessage: string;

    constructor(
        private messageService: MessageService,
        private router: Router,
        private authService: AuthService,
        private spinner: NgxSpinnerService,
        public layoutService: LayoutService,
        private service: ServiceService
    ) {}

    ngOnInit() {
        this.token = localStorage.getItem('token');
        this.url = sessionStorage.getItem('url');
        this.checkSessionTimeout();
    }

    startSessionTimeout() {
        clearTimeout(this.sessionTimeout);
        this.sessionTimeout = setTimeout(() => {
            this.logout();
        }, 3600000);
    }

    checkSessionTimeout() {
        const lastActivityTime = localStorage.getItem('lastActivityTime');
        if (lastActivityTime) {
            const elapsedTime =
                new Date().getTime() - parseInt(lastActivityTime);
            if (elapsedTime >= 3600000) {
                this.logout();
            } else {
                this.startSessionTimeout();
            }
        }
    }

    registerUser() {
        this.spinner.show('register');
        this.authService.register(this.user).subscribe(
            () => {
                this.checkToken = false;
                this.user = null;
                this.messageService.add({
                    key: 'tc',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'User enregistrer avec succèes',
                });
                this.spinner.hide('register');
            },
            (error: any) => {
                this.messageService.add({
                    key: 'tc',
                    severity: 'error',
                    summary: 'Error',
                    detail: `Une produit s'est produite, veuillez ressayer ou changer le username`,
                });
                this.spinner.hide('register');
                console.error(error);
            }
        );
    }

    login() {
        this.errorMessage="";
        if (!this.isValidEmail(this.username)) {
            this.errorMessage = "Format d'e-mail invalide";
            return;
        }
        this.errorMessage = null;
        this.service.login(this.username, this.password).subscribe(
            (user) => {
                localStorage.setItem('token', user.token);
                console.log('login successful');
                this.router.navigate(['/']);
            },
            (error: any) => {
                console.log('login error');
                this.errorMessage = error.error.message;
            }
        );
    }
    isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    navigateHome(role: string) {
        if (role === 'Emploie') {
            this.router.navigate(['/employe']);
        } else if (role === 'Manager') {
            this.router.navigate(['/manager']);
        }
    }

    logout() {
        this.authService.logout(this.token).subscribe((message) => {
            clearTimeout(this.sessionTimeout);
            this.ngOnInit();
        });
    }

    changePassword() {}

    updateLastActivityTime() {
        localStorage.setItem(
            'lastActivityTime',
            new Date().getTime().toString()
        );
    }

    showErrorViaMessages() {
        this.msgs = [];
        this.msgs.push({
            severity: 'error',
            summary: 'Error Message',
            detail: 'Validation failed',
        });
    }
}
