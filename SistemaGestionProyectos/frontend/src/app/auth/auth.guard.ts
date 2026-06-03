import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthStore } from "./auth-store";

export const authGuard: CanActivateFn = () => {

    const authStore: AuthStore = inject(AuthStore);
    const router: Router = inject(Router);

    if (authStore.obtenerToken()) {
        return true;
    }

    return router.createUrlTree(["/login"]);

};
