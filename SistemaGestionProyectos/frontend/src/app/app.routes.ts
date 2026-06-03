import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { TareasListado } from './proyectos/tareas/listado/tareas-listado';
import { TareasKanban } from './proyectos/tareas/kanban/tareas-kanban';
import { ProyectosListado } from './proyectos/listado/proyectos-listado';
import { ClientesPage } from './proyectos/clientes/page/clientes-page';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: "login",
        component: Login
    },
    {
        path: 'dashboard',
        component: Dashboard,
        canActivate: [authGuard]
    },
    {
        path: 'clientes',
        component: ClientesPage,
        canActivate: [authGuard]
    },
    {
        path: 'proyectos/:id/tareas/kanban',
        component: TareasKanban,
        canActivate: [authGuard]
    },
    {
        path: 'proyectos/:id/tareas',
        component: TareasListado,
        canActivate: [authGuard]
    },
    {
        path: 'proyectos',
        component: ProyectosListado,
        canActivate: [authGuard]
    },
    {
        path: "**",
        redirectTo: "login"
    }
];
