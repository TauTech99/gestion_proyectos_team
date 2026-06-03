import { Component, inject } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { AuthStore } from "../auth/auth-store";
import { RouterModule } from "@angular/router";

@Component({
    selector: 'app-template',
    templateUrl: './template.html',
    styleUrl: './template.css',
    imports: [ButtonModule, RouterModule]
})
export class Template {

    private readonly authStore: AuthStore = inject(AuthStore);

    cerrarSesion() {
        this.authStore.cerrarSesion();
    }

}