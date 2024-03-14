import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private cookieService: CookieService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var token = this.cookieService.get('sessionUser');
    if (token) {
      const authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
         // Authorization:`Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbG9jYWxob3N0OjgwMDAvYXBpL2xvZ2luIiwiaWF0IjoxNzA4ODUwMTc2LCJleHAiOjE3MDg4NTM3NzYsIm5iZiI6MTcwODg1MDE3NiwianRpIjoibk8yM3M4VTJubGNsSE1XNyIsInN1YiI6IjciLCJwcnYiOiIyM2JkNWM4OTQ5ZjYwMGFkYjM5ZTcwMWM0MDA4NzJkYjdhNTk3NmY3IiwiZmlyc3RfbmFtZSI6ImhhaGEiLCJsYXN0X25hbWUiOiJoZWhlIiwicm9sZV9pZCI6Mn0.ssjGXYDE84S94O5L7c48sFvt242_REnffGkYZG2hjTU`
           }
      });
      return next.handle(authReq);
    } else {
      return next.handle(req);
    }
  }
}