import { Injectable, Injector } from '@angular/core';
import { AlertService } from '../services/alert.service';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MessageService } from 'primeng/api';
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private alertService: AlertService) {}
 
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        //alert(error.status);
        if (error.status === 500) {
          alert("Erreur interne du serveur");
          this.alertService.setStatus("Erreur interne du serveur");
        }
        else if (error.status === 504 ) {
          this.alertService.setStatus("Délai de requete depassée");
        }
        else if (error.status === 0) {
          this.alertService.setStatus("Serveur actuellement indisponible");
        }
        else if (error.status === 422) {
          this.alertService.setStatus(error.error.message);
        }
        else if (error.status === 401) {
          this.alertService.setStatus(error.error.message);
        }
        else{
          this.alertService.setStatus("Erreur interne du serveur");
        }
          return throwError(error);
      })
    );
  }
}
