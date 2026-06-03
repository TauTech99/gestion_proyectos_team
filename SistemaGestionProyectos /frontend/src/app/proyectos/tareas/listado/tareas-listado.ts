import { Component, computed, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService, ConfirmationService } from "primeng/api";
import { ActivatedRoute } from "@angular/router";
import { ProyectoApiClient } from "./proyecto-api-client";
import { ProyectoDTO } from "./proyecto-dto";
import { ListTareaDTO } from "./list-tarea-dto";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { Template } from "../../../template/template";
import { TooltipModule } from "primeng/tooltip";
import { GestionTarea } from "../gestion/gestion-tarea";
import { EstadosTareasEnum } from "../estados-tareas-enum";
import { GestionTareaApiClient } from "../gestion/gestion-tarea-api-client";
import { ConfirmDialogModule } from "primeng/confirmdialog";

@Component({
    selector: "app-tareas-listado",
    templateUrl: "./tareas-listado.html",
    styleUrls: ["./tareas-listado.css"],
    imports: [TableModule, ButtonModule, Template, TooltipModule, GestionTarea, ConfirmDialogModule],
    providers: [ConfirmationService]
})
export class TareasListado implements OnInit {

    private readonly messageService: MessageService = inject(MessageService);
    private readonly proyectoApiClient: ProyectoApiClient = inject(ProyectoApiClient);
    private readonly gestionTareaApiClient: GestionTareaApiClient = inject(GestionTareaApiClient);
    private readonly confirmationService: ConfirmationService = inject(ConfirmationService);
    private readonly route: ActivatedRoute = inject(ActivatedRoute);

    idProyecto: WritableSignal<number | null> = signal(null);
    proyecto: WritableSignal<ProyectoDTO | null> = signal(null);
    dialogVisible: WritableSignal<boolean> = signal(false);
    tareaSeleccionada: WritableSignal<ListTareaDTO | null> = signal<ListTareaDTO | null>(null);

    tareasPendientes = computed(() =>
        this.proyecto()?.tareas.filter(t => t.estado === EstadosTareasEnum.PENDIENTE) ?? []
    );
    tareasFinalizadas = computed(() =>
        this.proyecto()?.tareas.filter(t => t.estado === EstadosTareasEnum.FINALIZADA) ?? []
    );
    tareasBaja = computed(() =>
        this.proyecto()?.tareas.filter(t => t.estado === EstadosTareasEnum.BAJA) ?? []
    );

    constructor() {
        effect(() => {
            if (!this.dialogVisible()) {
                const id = this.idProyecto();
                if (id) this.refrescarProyecto(id);
            }
        });
    }

    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id'));
        this.idProyecto.set(id);
        this.refrescarProyecto(id);
    }

    refrescarProyecto(id: number): void {
        this.proyectoApiClient.obtenerProyecto(id).subscribe({
            next: (data) => this.proyecto.set(data),
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener el proyecto' })
        });
    }

    crearTarea(): void {
        this.dialogVisible.set(true);
    }

    editarTarea(tarea: ListTareaDTO): void {
        this.tareaSeleccionada.set(tarea);
        this.dialogVisible.set(true);
    }

    eliminarTarea(tarea: ListTareaDTO): void {
        this.confirmationService.confirm({
            message: `¿Dar de baja la tarea "${tarea.descripcion}"?`,
            header: 'Confirmar baja',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí, dar de baja',
            rejectLabel: 'Cancelar',
            accept: () => {
                const idProyecto = this.idProyecto();
                if (!idProyecto) return;

                this.gestionTareaApiClient.actualizarTarea(idProyecto, tarea.id, {
                    descripcion: tarea.descripcion,
                    estado: EstadosTareasEnum.BAJA
                }).subscribe({
                    next: () => {
                        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarea dada de baja correctamente.' });
                        this.refrescarProyecto(idProyecto);
                    },
                    error: () => {
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al dar de baja la tarea.' });
                    }
                });
            }
        });
    }

}