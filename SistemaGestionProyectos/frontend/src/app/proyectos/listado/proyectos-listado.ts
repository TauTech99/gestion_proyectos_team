import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { DatePipe } from "@angular/common";
import { Router } from "@angular/router";
import { MessageService } from "primeng/api";
import { ListProyectoDTO } from "./list-proyecto-dto";
import { ProyectosListadoApiClient } from "./proyectos-listado-api-client";
import { ColumnaCsv, exportarCsv, fechaHoyParaArchivo } from "../../shared/csv-export";
import { Table, TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { TagModule } from 'primeng/tag';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { Template } from "../../template/template";
import { TooltipModule } from 'primeng/tooltip';
import { GestionProyecto } from "../gestion/gestion-proyecto";
import { EstadosProyectosEnum } from "../estados-proyectos-enum";

@Component({
  selector: "app-proyectos-listado",
  templateUrl: "./proyectos-listado.html",
  styleUrls: ["./proyectos-listado.css"],
  imports: [TableModule, ButtonModule, TagModule, InputTextModule, SelectModule, Template, TooltipModule, GestionProyecto, DatePipe]
})
export class ProyectosListado implements OnInit {

  readonly estados: string[] = Object.values(EstadosProyectosEnum);

  private readonly messageService: MessageService = inject(MessageService);

  private readonly proyectosListadoApiClient: ProyectosListadoApiClient = inject(ProyectosListadoApiClient);

  private readonly router: Router = inject(Router);

  proyectos: WritableSignal<ListProyectoDTO[]> = signal([]);

  dialogVisible: WritableSignal<boolean> = signal(false);

  proyectoSeleccionado: WritableSignal<ListProyectoDTO | null> = signal<ListProyectoDTO | null>(null);

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
    this.proyectosListadoApiClient.buscarProyectos().subscribe({
      next: (data) => {
        this.proyectos.set(data);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los proyectos' });
      }
    });
  }

  crearProyecto(): void {
    this.dialogVisible.set(true);
  }

  editarProyecto(proyecto: ListProyectoDTO): void {
    this.dialogVisible.set(true);
    this.proyectoSeleccionado.set(proyecto);
  }

  gestionarTareas(proyecto: ListProyectoDTO): void {
    this.router.navigate(['/proyectos', proyecto.id, 'tareas']);
  }

  exportar(dt: Table): void {
    const filas = (dt.filteredValue ?? this.proyectos()) as ListProyectoDTO[];
    if (filas.length === 0) {
      this.messageService.add({ severity: 'info', summary: 'Sin datos', detail: 'No hay proyectos para exportar' });
      return;
    }
    const columnas: ColumnaCsv<ListProyectoDTO>[] = [
      { encabezado: 'Nombre', valor: (p) => p.nombre },
      { encabezado: 'Cliente', valor: (p) => (p.cliente ? p.cliente.nombre : 'Interno') },
      { encabezado: 'Estado', valor: (p) => p.estado },
      { encabezado: 'Fecha fin', valor: (p) => (p.fechaFin ? p.fechaFin.split('-').reverse().join('/') : '') },
    ];
    exportarCsv(`proyectos_${fechaHoyParaArchivo()}.csv`, columnas, filas);
  }

}