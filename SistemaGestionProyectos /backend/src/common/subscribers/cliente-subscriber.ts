import { EntitySubscriberInterface, EventSubscriber, UpdateEvent, InsertEvent } from "typeorm";
import { Cliente } from "../../modules/gestion/entities/cliente.entity";

@EventSubscriber()
export class ClienteSubscriber implements EntitySubscriberInterface<Cliente> {

    constructor() {
        console.log("DEBUG: ClienteSubscriber cargado");
    }
    
    listenTo() {
        return Cliente;
    }

    async afterInsert(event: InsertEvent<Cliente>) {
        await this.guardarHistorial(event, 'INSERT');
    }

    async afterUpdate(event: UpdateEvent<Cliente>) {
        console.log("DEBUG: afterUpdate se ha disparado.");
        await this.guardarHistorial(event, 'UPDATE');
    }

    private async guardarHistorial(event: any, accion: string) {
        const idRegistro = event.entity?.id || event.databaseEntity?.id;
        
        console.log(`DEBUG: Intentando guardar historial para ID: ${idRegistro}, Acción: ${accion}`);

        if (!idRegistro) {
            console.log("DEBUG: No se pudo obtener el ID, por lo tanto no se escribió en el historial.");
            return;
        }

        const usuarioNombre = 'Sistema'; 
        
        try {
            await event.manager.query(
                'INSERT INTO historial_cambios (entidad, id_registro, accion, usuario_nombre) VALUES ($1, $2, $3, $4)',
                ['Cliente', idRegistro, accion, usuarioNombre]
            );
            console.log("DEBUG: ¡Historial guardado exitosamente en la base de datos!");
        } catch (error) {
            console.error("DEBUG: Error al intentar insertar en historial_cambios:", error);
        }
    }
}