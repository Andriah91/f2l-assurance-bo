import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { BehaviorSubject, Observable, map } from "rxjs";
import { environment } from "src/environments/environment";
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: "root",
})

export class ServiceService {
  private userSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getAllUsers(data: any): any {
    return this.http.post(`${environment.url}/api/searchUser`, data);
  }

  getAllAdmins(data: any): any {
    return this.http.post(`${environment.url}/api/searchAdmin`, data);
  }

  getAllNotifications(data: any): any {
    return this.http.post(`${environment.url}/api/searchNotif`, data);
  }

  getAllPublicities(data: any): any {
    return this.http.post(`${environment.url}/api/searchPub`, data);
  }

  getAllContrat(id: any): any {
    return this.http.get(`${environment.url}/api/contrats/${id}`, id);
  }

  createDocument(data: any): any {
    return this.http.post(`${environment.url}/api/documents`, data);
  }

  getDetailsUsers(id: any): any {
    return this.http.get(`${environment.url}/api/users/${id}`, id);
  }

  deleteUsers(id: any) {
    return this.http.delete(`${environment.url}/api/users/${id}`, id);
  }

  updateUser(data: any) {
    return this.http.post(`${environment.url}/api/users/info`, data);
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${environment.url}/api/logout`, {});
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${environment.url}/api/login`, { email, password })
      .pipe(
        map((user) => {
          this.userSubject.next(user);
          const {
            authorisation: { token },
          } = user;
          document.cookie = `sessionUser=${token}; path=/`;
          return user;
        })
      );
  }

  decodeToken(): any | null {
    try {
      let token = this.cookieService.get("sessionUser");
      if (token) {
        const decodedToken: any = jwtDecode(token);
        return decodedToken;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erreur lors du décodage du token : ", error);
      return null;
    }
  }

  findUser(): any {
    try {
      const decodedToken = this.decodeToken();
      if (decodedToken) {
        const user: any = {
          id: decodedToken.sub,
          first_name: decodedToken.first_name,
          last_name: decodedToken.last_name,
          is_admin: decodedToken.is_admin,
        };
        return user;
      } else {
        console.log(
          "Token introuvable"
        );
        return null;
      }
    } catch (error) {
      console.error("Erreur lors de la récupération du token : ", error);
      return null;
    }
  }

  upload(uploadData: any) {
    return this.http.post<any>(`${environment.url}/api/upload`, uploadData);
  }

  registerUser(data: any) {
    return this.http.post<any>(`${environment.url}/api/registerClient`, data);
  }

  registerAdmin(data: any) {
    return this.http.post<any>(`${environment.url}/api/register`, data);
  }

  registerContrat(data: any) {
    return this.http.post<any>(`${environment.url}/api/contrats`, data);
  }

  deleteContrat(id: any) {
    return this.http.delete(`${environment.url}/api/contrats/${id}`, id);
  }

  updateContrat(data: any) {
    return this.http.post(`${environment.url}/api/contrats/info`, data);
  }

  deletedoc(id: any) {
    return this.http.delete(`${environment.url}/api/documents/${id}`, id);
  }

  userStateNotification(data: any) {
    return this.http.post<any>(`${environment.url}/api/userNotif`, data);
  }

  fileStateNotification(data: any) {
    return this.http.post<any>(`${environment.url}/api/fileNotif`, data);
  }

  registerNotification(data: any) {
    return this.http.post<any>(`${environment.url}/api/pushNotif`, data);
  }

  deleteNotification(id: any) {
    return this.http.delete(`${environment.url}/api/notifications/${id}`, id);
  }

  updateNotification(data: any) {
    return this.http.post(`${environment.url}/api/notifications/info`, data);
  }

  updatePublicity(data: any) {
    return this.http.post(`${environment.url}/api/banieres/info`, data);
  }

  registerPublicity(data: any) {
    return this.http.post<any>(`${environment.url}/api/banieres`, data);
  }

  deletePublicity(id: any) {
    return this.http.delete(`${environment.url}/api/banieres/${id}`, id);
  }
  getDetailsPub(id: any): any {
    return this.http.get(`${environment.url}/api/banieres/${id}`, id);
  }

// Méthode pour récupérer toutes les cartes par client ID
 searchCartes(params: any): Observable<any> {
    return this.http.post(`${environment.url}/api/searchcartes`, params);
  }
// Méthode pour créer une carte
createCarte(carteData: any): Observable<any> {
  return this.http.post(`${environment.url}/api/cartes`, carteData);
}

// Méthode pour mettre à jour une carte
updateCarte(carteData: any): Observable<any> {
  return this.http.post(`${environment.url}/api/cartes/info`, carteData);
}

// Méthode pour supprimer une carte
deleteCarte(carteId: number): Observable<any> {
  return this.http.delete(`${environment.url}/api/cartes/${carteId}`);
}

// Méthode pour uploader une image
uploadCarteImage(uploadData: FormData): Observable<any> {
  return this.http.post(`${environment.url}/api/upload/image`, uploadData);
}
}
