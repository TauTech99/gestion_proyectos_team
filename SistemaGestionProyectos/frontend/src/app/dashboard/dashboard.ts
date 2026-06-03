import { Component, computed, inject, OnInit, Signal, signal, WritableSignal } from "@angular/core";
import { ButtonModule } from "primeng/button";
import { ChartModule } from "primeng/chart";
import { ProgressSpinnerModule } from "primeng/progressspinner";
import { MessageService } from "primeng/api";
import { Template } from "../template/template";
import { EstadisticasApiClient } from "./estadisticas-api-client";
import { EstadisticasDTO } from "./estadisticas-dto";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.html",
  styleUrls: ["./dashboard.css"],
  imports: [Template, ChartModule, ProgressSpinnerModule, ButtonModule]
})
export class Dashboard implements OnInit {

  private readonly estadisticasApiClient: EstadisticasApiClient = inject(EstadisticasApiClient);

  private readonly messageService: MessageService = inject(MessageService);

  readonly estadisticas: WritableSignal<EstadisticasDTO | null> = signal(null);

  readonly cargando: WritableSignal<boolean> = signal(true);

  readonly error: WritableSignal<boolean> = signal(false);

  private readonly colorTexto = '#F4F4F7';
  private readonly colorTextoSuave = '#A1A1B5';
  private readonly colorBorde = '#2A2A45';
  private readonly colorPrimary = '#F59E0B';
  private readonly colorSuccess = '#4ADE80';
  private readonly colorDanger = '#FB7185';
  private readonly colorInfo = '#60A5FA';

  readonly configProyectosPorEstado: Signal<unknown | null> = computed(() => {
    const e = this.estadisticas();
    if (!e) {
      return null;
    }
    return {
      labels: ['Activos', 'Finalizados', 'Baja'],
      datasets: [{
        data: [e.proyectosActivos, e.proyectosFinalizados, e.proyectosBaja],
        backgroundColor: [this.colorPrimary, this.colorSuccess, this.colorDanger],
        borderColor: this.colorBorde,
        borderWidth: 2
      }]
    };
  });

  readonly configTareasPorEstado: Signal<unknown | null> = computed(() => {
    const e = this.estadisticas();
    if (!e) {
      return null;
    }
    return {
      labels: ['Pendientes', 'Finalizadas', 'Baja'],
      datasets: [{
        data: [e.tareasPendientes, e.tareasFinalizadas, e.tareasBaja],
        backgroundColor: [this.colorInfo, this.colorSuccess, this.colorDanger],
        borderColor: this.colorBorde,
        borderWidth: 2
      }]
    };
  });

  readonly configProyectosPorCliente: Signal<unknown | null> = computed(() => {
    const e = this.estadisticas();
    if (!e || e.totalProyectosPorCliente.length === 0) {
      return null;
    }
    return {
      labels: e.totalProyectosPorCliente.map(p => p.cliente),
      datasets: [{
        label: 'Proyectos',
        data: e.totalProyectosPorCliente.map(p => p.cantidad),
        backgroundColor: this.colorPrimary,
        borderColor: this.colorPrimary,
        borderWidth: 1
      }]
    };
  });

  readonly opcionesDoughnut = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: this.colorTexto,
          font: { size: 13 }
        }
      }
    }
  };

  readonly opcionesBarrasHorizontal = {
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: this.colorTextoSuave, stepSize: 1 },
        grid: { color: this.colorBorde }
      },
      y: {
        ticks: { color: this.colorTextoSuave },
        grid: { color: this.colorBorde }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.cargando.set(true);
    this.error.set(false);

    this.estadisticasApiClient.obtenerEstadisticas().subscribe({
      next: (data) => {
        this.estadisticas.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set(true);
        this.cargando.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al obtener las estadísticas'
        });
      }
    });
  }

}
