export interface ListProyectoDTO {
    id: number;
    nombre: string;
    estado: string;
    cliente?: {
        id: number;
        nombre: string;
        estado: string;
    };
}