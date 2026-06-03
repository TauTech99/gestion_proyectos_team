import { Component, effect, inject, NgModule, OnInit, signal, WritableSignal } from "@angular/core";
import { NgClass } from "@angular/common";
import { MessageService } from "primeng/api";
import { ListProyectoDTO } from "./list-proyecto-dto";
import { ProyectosListadoApiClient } from "./proyectos-listado-api-client";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { Template } from "../../template/template";
import { TooltipModule } from "primeng/tooltip";
import { GestionProyecto } from "../gestion/gestion-proyecto";
import { InputTextModule } from "primeng/inputtext";

@Component({
    selector: "app-proyectos-listado",
    templateUrl: "./proyectos-listado.html",
    styleUrls: ["./proyectos-listado.css"],
    imports: [TableModule, ButtonModule, Template, TooltipModule, GestionProyecto, NgClass, InputTextModule]
})
export class ProyectosListado implements OnInit {

    private readonly messageService: MessageService = inject(MessageService);
    private readonly proyectosListadoApiClient: ProyectosListadoApiClient = inject(ProyectosListadoApiClient);

    proyectos: WritableSignal<ListProyectoDTO[]> = signal([]);
    dialogVisible: WritableSignal<boolean> = signal(false);
    proyectoSeleccionado: WritableSignal<ListProyectoDTO | null> = signal<ListProyectoDTO | null>(null);
    nombreBusqueda: WritableSignal<string> = signal('');
    estadoBusqueda: WritableSignal<string> = signal('');

    constructor() {
        effect(() => {
            if (!this.dialogVisible()) {
                this.refrescarProyectos();
            }
        });
    }

    ngOnInit(): void {
        this.refrescarProyectos();
    }

    refrescarProyectos(): void {
        this.proyectosListadoApiClient.buscarProyectos(this.nombreBusqueda(), this.estadoBusqueda()).subscribe({
            next: (data) => this.proyectos.set(data),
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al obtener los proyectos' })
        });
    }

    buscarPorNombre(nombre: string): void {
        this.nombreBusqueda.set(nombre);
        this.refrescarProyectos();
    }

    buscarPorEstado(estado: string): void {
        this.estadoBusqueda.set(estado);
        this.refrescarProyectos();
    }

    crearProyecto(): void { this.dialogVisible.set(true); }

    editarProyecto(proyecto: ListProyectoDTO): void {
        this.dialogVisible.set(true);
        this.proyectoSeleccionado.set(proyecto);
    }

    gestionarTareas(proyecto: ListProyectoDTO): void {
        window.open(`/proyectos/${proyecto.id}/tareas`, '_blank');
    }

    diasRestantes(fecha?: string): number | null {
        if (!fecha) return null;
        const hoy = new Date();
        const fin = new Date(fecha);
        return Math.ceil((fin.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    }

    initials(name?: string): string {
        if (!name) return '—';
        return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
    }
}