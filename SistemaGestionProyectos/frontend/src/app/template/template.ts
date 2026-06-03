import { Component , inject, signal} from "@angular/core";
import { ButtonModule } from "primeng/button";
import { AuthStore } from "../auth/auth-store";

@Component({
    selector: 'app-template',
    templateUrl: './template.html',
    styleUrl: './template.css',
    imports: [ButtonModule]
})

export class Template{

    dark = signal(false);
    private readonly authStore: AuthStore = inject(AuthStore);

    toggleDark() { this.dark.update(v => !v); }

    logout(){
        this.authStore.cerrarSesion();
    }
}