import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { ListProyectoDTO } from "./list-proyecto-dto";
import { ProyectosListadoApiClient } from "./proyectos-listado-api-client";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { Template } from "../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionProyecto } from "../gestion/gestion-proyecto";
import { ClientesListado } from "../clientes/listado/clientes-listado";
import { Router } from "@angular/router";
import { LowerCasePipe } from "@angular/common";

@Component({
    selector: "app-proyectos-listado",
    templateUrl: "./proyectos-listado.html",
    styleUrls: ["./proyectos-listado.css"],
    imports: [TableModule, ButtonModule, Template, TooltipModule, GestionProyecto, ClientesListado, LowerCasePipe]
})
export class ProyectosListado implements OnInit {

    private readonly messageService: MessageService = inject(MessageService);
    private readonly proyectosListadoApiClient: ProyectosListadoApiClient = inject(ProyectosListadoApiClient);
    private readonly router: Router = inject(Router);

    proyectos: WritableSignal<ListProyectoDTO[]> = signal([]);
    dialogVisible: WritableSignal<boolean> = signal(false);
    dialogClientesVisible: WritableSignal<boolean> = signal(false);
    proyectoSeleccionado: WritableSignal<ListProyectoDTO | null> = signal<ListProyectoDTO | null>(null);

    constructor() {
        // Refresh list when gestion dialog closes
        effect(() => {
            if (!this.dialogVisible()) {
                this.refrescarProyectos();
            }
        });
        // Also refresh when clientes dialog closes
        effect(() => {
            if (!this.dialogClientesVisible()) {
                this.refrescarProyectos();
            }
        });
    }

    ngOnInit(): void {
        this.refrescarProyectos();
    }

    refrescarProyectos(): void {
        this.proyectosListadoApiClient.buscarProyectos().subscribe({
            next: (data) => {
                this.proyectos.set(data);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los proyectos' });
            }
        });
    }

    crearProyecto(): void {
        this.proyectoSeleccionado.set(null);
        this.dialogVisible.set(true);
    }

    editarProyecto(proyecto: ListProyectoDTO): void {
        this.proyectoSeleccionado.set(proyecto);
        this.dialogVisible.set(true);
    }

    gestionarTareas(proyecto: ListProyectoDTO): void {
        this.router.navigate(['/proyectos', proyecto.id, 'tareas']);
    }

    abrirClientes(): void {
        this.dialogClientesVisible.set(true);
    }

}
