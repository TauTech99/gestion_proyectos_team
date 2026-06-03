import { Routes } from '@angular/router';
import { Login } from './auth/login/login';

export const routes: Routes = [
    {
        path: "login",
        component: Login
    },
    {
        path: "**",
        redirectTo: "login"
    }
];