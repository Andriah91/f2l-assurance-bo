import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';
import { LayoutService } from 'src/app/general/service/app.layout.service';
import { ServiceService } from 'src/app/manager/services/service.service';
import { AlertService } from 'src/app/manager/services/alert.service';
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `.custom-class {
            cursor: not-allowed;
        }
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
        private service: ServiceService,
        private statusService : AlertService
    ) {}

    ngOnInit() {
        this.disableFunction();
    } 
    
    disableFunction() {
        if ((this.username === "") || this.password === "") {
            this.disabledlogin = true;
        } else {
            this.disabledlogin = false;
        }
    }

    login() {
        this.spinner.show("login");
        this.errorMessage="";

        if (!this.isValidEmail(this.username)) {
            this.spinner.hide("login");
            this.errorMessage = "Format d'e-mail invalide";
            return;
        }
        
        this.errorMessage = null;
        this.service.login(this.username, this.password).subscribe(
            (user) => {
                // localStorage.setItem('token', user.token);
                // console.log('login successful');
                this.spinner.hide("login");
                 this.router.navigate(['/']);
            },
            (error: any) => {
                let status = this.statusService.getStatus();
                this.spinner.hide("login");
                this.messageService.add({ severity: 'error', summary: 'Error', detail:  status });
               
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
