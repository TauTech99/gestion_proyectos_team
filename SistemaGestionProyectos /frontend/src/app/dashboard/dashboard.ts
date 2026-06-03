import { Component, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { DashboardApiClient } from "./dashboard-api-client";
import { EstadisticasDTO } from "./estadisticas-dto";
import { MessageService } from "primeng/api";
import { Template } from "../template/template";
import { TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { ProyectosListadoApiClient } from "../proyectos/listado/proyectos-listado-api-client";
import { ClientesListadoApiClient } from "../proyectos/clientes/listado/clientes-listado-api-client";
import { forkJoin } from "rxjs";

@Component({
    selector: "app-dashboard",
    templateUrl: "./dashboard.html",
    styleUrls: ["./dashboard.css"],
    imports: [Template, TableModule, ButtonModule]
})
export class Dashboard implements OnInit {

    private readonly dashboardApiClient = inject(DashboardApiClient);
    private readonly proyectosApiClient = inject(ProyectosListadoApiClient);
    private readonly clientesApiClient = inject(ClientesListadoApiClient);
    private readonly messageService = inject(MessageService);

    estadisticas: WritableSignal<EstadisticasDTO | null> = signal(null);
    exportando: WritableSignal<boolean> = signal(false);

    ngOnInit(): void {
        this.dashboardApiClient.obtenerEstadisticas().subscribe({
            next: (data) => this.estadisticas.set(data),
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener estadísticas' })
        });
    }

    exportarCSV(): void {
        this.exportando.set(true);

        forkJoin({
            proyectos: this.proyectosApiClient.buscarProyectos(),
            clientes: this.clientesApiClient.buscarClientes()
        }).subscribe({
            next: ({ proyectos, clientes }) => {
                const stats = this.estadisticas();
                const lineas: string[] = [];

                // Sección proyectos
                lineas.push('PROYECTOS');
                lineas.push('Nombre,Cliente,Estado');
                proyectos.forEach(p => {
                    const cliente = p.cliente?.nombre ?? 'Sin cliente';
                    lineas.push(`"${p.nombre}","${cliente}","${p.estado}"`);
                });

                lineas.push('');

                // Sección clientes
                lineas.push('CLIENTES');
                lineas.push('Nombre,Estado');
                clientes.forEach(c => {
                    lineas.push(`"${c.nombre}","${c.estado}"`);
                });

                lineas.push('');

                // Sección estadísticas
                lineas.push('ESTADÍSTICAS');
                if (stats) {
                    lineas.push(`Total de proyectos,${stats.totalProyectos}`);
                    lineas.push(`Proyectos activos,${stats.proyectosActivos}`);
                    lineas.push(`Proyectos finalizados,${stats.proyectosFinalizados}`);
                    lineas.push(`Proyectos dados de baja,${stats.proyectosBaja}`);
                    lineas.push(`Total de tareas,${stats.totalTareas}`);
                    lineas.push(`Tareas pendientes,${stats.tareasPendientes}`);
                    lineas.push(`Tareas finalizadas,${stats.tareasFinalizadas}`);
                    lineas.push(`Tareas dadas de baja,${stats.tareasBaja}`);
                    lineas.push(`Total de clientes,${stats.totalClientes}`);
                    lineas.push(`Clientes activos,${stats.clientesActivos}`);
                    lineas.push(`Clientes dados de baja,${stats.clientesBaja}`);
                }

                // Generar y descargar el archivo
                const contenido = '\uFEFF' + lineas.join('\n'); // \uFEFF = BOM para que Excel lo abra bien
                const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                const fecha = new Date().toISOString().slice(0, 10);
                link.href = url;
                link.download = `reporte-${fecha}.csv`;
                link.click();
                URL.revokeObjectURL(url);

                this.exportando.set(false);
            },
            error: () => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al generar el reporte' });
                this.exportando.set(false);
            }
        });
    }

}