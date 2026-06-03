import { Routes } from '@angular/router';
import { Login } from './auth/login/login' ;
import { ProyectosListado} from './proyectos/listado/proyectos-listado';
import { TareasListado } from './proyectos/tareas/listado/tareas-listado'

export const routes: Routes = [
    {path: "login", component: Login},
    {path: "proyectos/:id/tareas", component: TareasListado},
    {path: "proyectos", component: ProyectosListado},
    {path: "**", redirectTo: "login"}
];
