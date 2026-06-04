import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { CdkDragDrop, DragDropModule, moveItemInArray } from "@angular/cdk/drag-drop";
import { ConfirmationService, MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { ConfirmDialogModule } from "primeng/confirmdialog";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { Template } from "../../../template/template";
import { ProyectoApiClient } from "../listado/proyecto-api-client";
import { ProyectoDTO } from "../listado/proyecto-dto";
import { ListTareaDTO } from "../listado/list-tarea-dto";
import { GestionTarea } from "../gestion/gestion-tarea";
import { GestionTareaApiClient } from "../gestion/gestion-tarea-api-client";
import { EstadosTareasEnum } from "../estados-tareas-enum";

@Component({
  selector: "app-tareas-kanban",
  templateUrl: "./tareas-kanban.html",
  styleUrls: ["./tareas-kanban.css"],
  providers: [ConfirmationService],
  imports: [
    Template,
    DragDropModule,
    ButtonModule,
    TooltipModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    GestionTarea,
    DatePipe
  ]
})
export class TareasKanban implements OnInit {

  protected readonly EstadosTareasEnum = EstadosTareasEnum;

  private readonly proyectoApiClient = inject(ProyectoApiClient);

  private readonly gestionTareaApiClient = inject(GestionTareaApiClient);

  private readonly messageService = inject(MessageService);

  private readonly confirmationService = inject(ConfirmationService);

  private readonly router = inject(Router);

  private readonly route = inject(ActivatedRoute);

  readonly idProyecto: WritableSignal<number | null> = signal<number | null>(null);

  readonly proyecto: WritableSignal<ProyectoDTO | null> = signal(null);

  readonly cargando: WritableSignal<boolean> = signal(true);

  readonly error: WritableSignal<boolean> = signal(false);

  readonly pendientes: WritableSignal<ListTareaDTO[]> = signal([]);

  readonly finalizadas: WritableSignal<ListTareaDTO[]> = signal([]);

  readonly bajas: WritableSignal<ListTareaDTO[]> = signal([]);

  private readonly guardando: WritableSignal<Set<number>> = signal(new Set<number>());

  dialogVisible: WritableSignal<boolean> = signal(false);

  tareaSeleccionada: WritableSignal<ListTareaDTO | null> = signal<ListTareaDTO | null>(null);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.cargarProyecto();
      }
    });

    const idParam = this.route.snapshot.paramMap.get("id");
    const idParsed = Number(idParam);
    const idValido = idParam !== null && Number.isInteger(idParsed) && idParsed > 0;

    if (!idValido) {
      this.messageService.add({ severity: "error", summary: "Error", detail: "Id de proyecto no válido" });
      this.router.navigateByUrl("/proyectos");
      return;
    }

    this.idProyecto.set(idParsed);
  }

  ngOnInit(): void {
    this.cargarProyecto();
  }

  cargarProyecto(): void {
    if (this.idProyecto() === null) {
      return;
    }
    this.error.set(false);
    this.proyectoApiClient.buscarProyecto(this.idProyecto()).subscribe({
      next: (data) => {
        this.proyecto.set(data);
        const tareas = data.tareas ?? [];
        this.pendientes.set(tareas.filter((t) => t.estado === EstadosTareasEnum.PENDIENTE));
        this.finalizadas.set(tareas.filter((t) => t.estado === EstadosTareasEnum.FINALIZADA));
        this.bajas.set(tareas.filter((t) => t.estado === EstadosTareasEnum.BAJA));
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
        this.messageService.add({ severity: "error", summary: "Error", detail: "Error al obtener el proyecto" });
      }
    });
  }

  drop(event: CdkDragDrop<ListTareaDTO[]>, destino: EstadosTareasEnum): void {
    if (event.previousContainer === event.container) {
      const reordenadas = [...event.container.data];
      moveItemInArray(reordenadas, event.previousIndex, event.currentIndex);
      this.columna(destino).set(reordenadas);
      return;
    }

    const tarea = event.previousContainer.data[event.previousIndex];
    const origen = tarea.estado;
    const indiceDestino = event.currentIndex;

    if (destino === EstadosTareasEnum.BAJA) {
      this.confirmationService.confirm({
        header: "Confirmar baja",
        message: `¿Dar de baja la tarea "${tarea.descripcion}"? Es una baja lógica y deja de estar activa.`,
        icon: "pi pi-exclamation-triangle",
        acceptLabel: "Dar de baja",
        rejectLabel: "Cancelar",
        accept: () => this.moverYGuardar(tarea, origen, destino, indiceDestino)
      });
      return;
    }

    this.moverYGuardar(tarea, origen, destino, indiceDestino);
  }

  private moverYGuardar(tarea: ListTareaDTO, origen: EstadosTareasEnum, destino: EstadosTareasEnum, indiceDestino: number): void {
    const tareaActualizada: ListTareaDTO = { ...tarea, estado: destino };

    this.columna(origen).update((arr) => arr.filter((t) => t.id !== tarea.id));
    this.columna(destino).update((arr) => {
      const copia = [...arr];
      copia.splice(indiceDestino, 0, tareaActualizada);
      return copia;
    });

    this.marcarGuardando(tarea.id);

    this.gestionTareaApiClient
      .actualizarTarea(this.idProyecto(), tarea.id, { descripcion: tarea.descripcion, estado: destino })
      .subscribe({
        next: () => {
          this.desmarcarGuardando(tarea.id);
          this.messageService.add({ severity: "success", summary: "Éxito", detail: "Tarea actualizada correctamente." });
        },
        error: () => {
          this.desmarcarGuardando(tarea.id);
          this.revertir(tareaActualizada, origen, destino);
          this.messageService.add({ severity: "error", summary: "Error", detail: "No se pudo actualizar la tarea. Se restauró su columna original." });
        }
      });
  }

  private revertir(tarea: ListTareaDTO, origen: EstadosTareasEnum, destino: EstadosTareasEnum): void {
    const tareaRevertida: ListTareaDTO = { ...tarea, estado: origen };
    this.columna(destino).update((arr) => arr.filter((t) => t.id !== tarea.id));
    this.columna(origen).update((arr) => [...arr, tareaRevertida]);
  }

  private columna(estado: EstadosTareasEnum): WritableSignal<ListTareaDTO[]> {
    switch (estado) {
      case EstadosTareasEnum.FINALIZADA:
        return this.finalizadas;
      case EstadosTareasEnum.BAJA:
        return this.bajas;
      default:
        return this.pendientes;
    }
  }

  estaGuardando(id: number): boolean {
    return this.guardando().has(id);
  }

  private marcarGuardando(id: number): void {
    this.guardando.update((s) => {
      const copia = new Set(s);
      copia.add(id);
      return copia;
    });
  }

  private desmarcarGuardando(id: number): void {
    this.guardando.update((s) => {
      const copia = new Set(s);
      copia.delete(id);
      return copia;
    });
  }

  iconoEstado(estado: EstadosTareasEnum): string {
    switch (estado) {
      case EstadosTareasEnum.FINALIZADA:
        return "check_circle";
      case EstadosTareasEnum.BAJA:
        return "block";
      default:
        return "schedule";
    }
  }

  crearTarea(): void {
    this.tareaSeleccionada.set(null);
    this.dialogVisible.set(true);
  }

  editarTarea(tarea: ListTareaDTO): void {
    this.tareaSeleccionada.set(tarea);
    this.dialogVisible.set(true);
  }

  irATabla(): void {
    this.router.navigate(["/proyectos", this.idProyecto(), "tareas"]);
  }

}
