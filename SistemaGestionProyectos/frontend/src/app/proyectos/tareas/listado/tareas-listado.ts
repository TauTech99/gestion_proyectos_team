import { Component, computed, effect, inject, OnInit, Signal, signal, WritableSignal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { MessageService } from "primeng/api";
import { ListTareaDTO } from "./list-tarea-dto";
import { ColumnaCsv, exportarCsv, fechaHoyParaArchivo } from "../../../shared/csv-export";
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Template } from "../../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionTarea } from "../gestion/gestion-tarea";
import { ActivatedRoute, Router } from "@angular/router";
import { ProyectoApiClient } from "./proyecto-api-client";
import { ProyectoDTO } from "./proyecto-dto";
import { EstadosTareasEnum } from "../estados-tareas-enum";

@Component({
  selector: "app-tareas-listado",
  templateUrl: "./tareas-listado.html",
  styleUrls: ["./tareas-listado.css"],
  imports: [TableModule, ButtonModule, InputTextModule, SelectModule, Template, TooltipModule, GestionTarea, DatePipe]
})
export class TareasListado implements OnInit {

  readonly estados: string[] = Object.values(EstadosTareasEnum);

  private readonly messageService: MessageService = inject(MessageService);

  private readonly proyectoApiClient: ProyectoApiClient = inject(ProyectoApiClient);

  proyecto: WritableSignal<ProyectoDTO | null> = signal(null);

  tareas: Signal<ListTareaDTO[]> = computed(() => {
    return this.proyecto()?.tareas || [];
  });

  dialogVisible: WritableSignal<boolean> = signal(false);

  tareaSeleccionada: WritableSignal<ListTareaDTO | null> = signal<ListTareaDTO | null>(null);

  private readonly router: Router = inject(Router);

  readonly idProyecto: WritableSignal<number | null> = signal<number | null>(null);

  private readonly route = inject(ActivatedRoute);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refreshProyecto();
      }
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    const idParsed = Number(idParam);
    const idValido = idParam !== null && Number.isInteger(idParsed) && idParsed > 0;

    if (!idValido) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Id de proyecto no válido' });
      this.router.navigateByUrl("/proyectos");
      return;
    }

    this.idProyecto.set(idParsed);
  }

  ngOnInit(): void {
    this.refreshProyecto();
  }

  refreshProyecto(): void {
    if (this.idProyecto() === null) {
      return;
    }
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

  irAKanban(): void {
    this.router.navigate(["/proyectos", this.idProyecto(), "tareas", "kanban"]);
  }

  editarTarea(tarea: ListTareaDTO): void {
    this.dialogVisible.set(true);
    this.tareaSeleccionada.set(tarea);
  }

  exportar(dt: Table): void {
    const filas = (dt.filteredValue ?? this.tareas()) as ListTareaDTO[];
    if (filas.length === 0) {
      this.messageService.add({ severity: 'info', summary: 'Sin datos', detail: 'No hay tareas para exportar' });
      return;
    }
    const columnas: ColumnaCsv<ListTareaDTO>[] = [
      { encabezado: 'Nombre', valor: (t) => t.descripcion },
      { encabezado: 'Estado', valor: (t) => t.estado },
    ];
    const nombreProyecto = this.proyecto()?.nombre ?? 'proyecto';
    const slug = nombreProyecto.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
    exportarCsv(`tareas_${slug}_${fechaHoyParaArchivo()}.csv`, columnas, filas);
  }

}