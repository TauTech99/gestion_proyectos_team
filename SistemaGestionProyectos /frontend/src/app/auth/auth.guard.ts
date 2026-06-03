import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "./auth-store";

export const authGuard: CanActivateFn = () => {
    const authStore = inject(AuthStore);
    const router = inject(Router);

    if (authStore.obtenerToken()) {
        return true;
    }

    router.navigateByUrl("/login");
    return false;
};