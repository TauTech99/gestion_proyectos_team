export interface EstadisticasDTO {
    proyectosActivos: number;
    proyectosFinalizados: number;
    proyectosBaja: number;
    totalProyectos: number;
    tareasPendientes: number;
    tareasFinalizadas: number;
    tareasBaja: number;
    totalTareas: number;
    clientesActivos: number;
    clientesBaja: number;
    totalClientes: number;
    totalProyectosPorCliente: {
        cliente: string;
        cantidad: number;
    }[];
}