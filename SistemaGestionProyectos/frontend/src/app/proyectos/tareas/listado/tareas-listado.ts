import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { ListTareaDTO } from "./list-tarea-dto";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { Template } from "../../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionTarea } from "../gestion/gestion-tarea";
import { ActivatedRoute, Router } from "@angular/router";
import { ProyectoApiClient } from "./proyecto-api-client";
import { ProyectoDTO } from "./proyecto-dto";

@Component({
    selector: "app-tareas-listado",
    templateUrl: "./tareas-listado.html",
    styleUrls: ["./tareas-listado.css"],
    imports: [TableModule, ButtonModule, Template, TooltipModule, GestionTarea]
})

export class TareasListado implements OnInit {

    private readonly messageService: MessageService = inject(MessageService);
    private readonly proyectoApiClient: ProyectoApiClient = inject(ProyectoApiClient);
    private readonly router: Router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    proyecto: WritableSignal<ProyectoDTO | null> = signal(null);
    tareas: Signal<ListTareaDTO[]> = computed(() => {
        return this.proyecto()?.tareas || [];
    });
    dialogVisible: WritableSignal<boolean> = signal(false);
    tareaSeleccionada: WritableSignal<ListTareaDTO | null> = signal<ListTareaDTO | null>(null);

    readonly idProyecto: WritableSignal<number | null> = signal<number | null>(null);

    constructor() {
        effect(() => {
        if (!this.dialogVisible()) {
            this.refreshProyecto();
        }
        });
        this.idProyecto.set(Number(this.route.snapshot.paramMap.get('id')));

        if (this.idProyecto() === null) {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Id de proyecto no válido' });
        this.router.navigateByUrl("/proyectos");
        }

    }

    ngOnInit(): void {
        this.refreshProyecto();
    }

    refreshProyecto(): void {
        this.proyectoApiClient.buscarProyecto(this.idProyecto()).subscribe({
        next: (data) => {
            this.proyecto.set(data);
        },
        error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el proyecto' });
        }
        });
    }

    crearTarea(): void {
        this.dialogVisible.set(true);
    }

    editarTarea(tarea: ListTareaDTO): void {
        this.dialogVisible.set(true);
        this.tareaSeleccionada.set(tarea);
    }

    abrirDialog(): void {
        this.dialogVisible.set(true);
    }

}