import { Component, inject, input, signal } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthStore } from "../auth/auth-store";

@Component({
    selector: 'app-template',
    templateUrl: './template.html',
    styleUrl: './template.css',
    imports: [RouterLink, RouterLinkActive]
})
export class Template {

    private readonly authStore: AuthStore = inject(AuthStore);

    titulo = input<string>('');

    sidebarAbierto = signal<boolean>(false);

    toggleSidebar(): void {
        this.sidebarAbierto.update((v) => !v);
    }

    cerrarSidebar(): void {
        this.sidebarAbierto.set(false);
    }

    cerrarSesion(): void {
        this.authStore.cerrarSesion();
    }
}
