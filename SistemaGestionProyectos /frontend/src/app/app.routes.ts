import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { ProyectosListado } from './proyectos/listado/proyectos-listado';
import { TareasListado } from './proyectos/tareas/listado/tareas-listado';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: "login",
        component: Login
    },
    {
        path: "proyectos",
        component: ProyectosListado,
        canActivate: [authGuard]
    },
    {
        path: "proyectos/:id/tareas",
        component: TareasListado,
        canActivate: [authGuard]
    },
    {
        path: "dashboard",
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: "**",
        redirectTo: "login"
    }
];