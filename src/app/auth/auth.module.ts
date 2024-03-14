import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AuthComponent } from "./auth.component";
import { AuthRoutes } from "./auth.routing.module";
import { GeneralModule } from "../general/general.module";
import { LoginComponent } from "./pages/login/login.component";
import { FormsModule } from "@angular/forms";
import { ToastModule } from "primeng/toast";
import { ConfirmationService, MessageService } from "primeng/api";
import { NgxSpinnerModule } from "ngx-spinner";
import { CheckboxModule } from "primeng/checkbox";
import { PasswordModule } from "primeng/password";
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { MessagesModule } from "primeng/messages";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { ConfirmDialogModule } from "primeng/confirmdialog";

@NgModule({
  imports: [
    CommonModule,
    AuthRoutes,
    GeneralModule,
    FormsModule,
    ToastModule,
    NgxSpinnerModule,
    CheckboxModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
    MessagesModule,
    ProgressSpinnerModule,
    ConfirmDialogModule,
  ],
  declarations: [AuthComponent, LoginComponent],
  providers: [MessageService, ConfirmationService],
})
export class AuthModule {}
