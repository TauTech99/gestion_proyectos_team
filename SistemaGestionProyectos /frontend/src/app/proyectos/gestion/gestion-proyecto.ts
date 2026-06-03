import { Component, computed, effect, inject, model, ModelSignal, Signal, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { GestionProyectoApiClient } from "./gestion-proyecto-api-client";
import { CreateProyectoDTO } from "./create-proyecto-dto";
import { UpdateProyectoDTO } from "./update-proyecto-dto";
import { EstadosProyectosEnum } from "../estados-proyectos-enum";
import { ListProyectoDTO } from "../listado/list-proyecto-dto";
import { ListClienteDTO } from "../clientes/listado/list-cliente-dto";

@Component({
    selector: "app-gestion-proyecto",
    templateUrl: "./gestion-proyecto.html",
    styleUrls: ["./gestion-proyecto.css"],
    imports: [DialogModule, InputTextModule, SelectModule, ButtonModule, ReactiveFormsModule]
})
export class GestionProyecto {

    visible: ModelSignal<boolean> = model(false);
    proyectoSeleccionado: ModelSignal<ListProyectoDTO | null> = model<ListProyectoDTO | null>(null);

    readonly estadosProyecto: WritableSignal<string[]> = signal(Object.values(EstadosProyectosEnum));
    readonly clientesActivos: WritableSignal<ListClienteDTO[]> = signal([]);

    private readonly messageService: MessageService = inject(MessageService);
    private readonly gestionProyectoApiClient = inject(GestionProyectoApiClient);

    header: Signal<string> = computed(() => {
        return this.proyectoSeleccionado() ? "Editar proyecto" : "Crear proyecto";
    });

    // El select de cliente se deshabilita si el proyecto NO está activo.
    // Al crear siempre está habilitado (no hay proyectoSeleccionado).
    readonly clienteDeshabilitado: Signal<boolean> = computed(() => {
        const proyecto = this.proyectoSeleccionado();
        if (!proyecto) return false;
        return proyecto.estado !== EstadosProyectosEnum.ACTIVO;
    });

    readonly form: FormGroup = new FormGroup({
        nombre: new FormControl("", [Validators.required]),
        estado: new FormControl(null),
        idCliente: new FormControl(null)
    });

    constructor() {
        effect(() => {
            if (this.visible()) {
                this.cargarClientesYParchear();
            }
        });
    }

    cargarClientesYParchear(): void {
        this.gestionProyectoApiClient.obtenerClientesActivos().subscribe({
            next: (data) => {
                this.clientesActivos.set(data);

                const proyecto = this.proyectoSeleccionado();
                if (proyecto) {
                    this.form.patchValue({
                        nombre: proyecto.nombre,
                        estado: proyecto.estado,
                        idCliente: proyecto.cliente?.id ?? null
                    });
                } else {
                    this.form.reset({ nombre: "", estado: null, idCliente: null });
                }
            },
            error: () => this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al cargar los clientes' })
        });
    }

    cerrarDialog(): void {
        this.proyectoSeleccionado.set(null);
        this.clientesActivos.set([]);
        this.form.reset({ nombre: "", estado: null, idCliente: null });
        this.visible.set(false);
    }

    guardarProyecto(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos requeridos.' });
            return;
        }

        const formRawValue = this.form.getRawValue();

        if (this.proyectoSeleccionado()) {
            const dto: UpdateProyectoDTO = {
                nombre: formRawValue.nombre,
                estado: formRawValue.estado,
                idCliente: formRawValue.idCliente ?? null
            };
            this.gestionProyectoApiClient.actualizarProyecto(this.proyectoSeleccionado()?.id!, dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proyecto actualizado correctamente.' });
                    this.cerrarDialog();
                },
                error: (err) => {
                    const detail = err.error?.statusCode >= 400 && err.error?.statusCode < 500
                        ? err.error.message
                        : "Error al actualizar el proyecto";
                    this.messageService.add({ severity: 'error', summary: 'Error', detail });
                }
            });
        } else {
            const dto: CreateProyectoDTO = {
                nombre: formRawValue.nombre,
                idCliente: formRawValue.idCliente ?? null
            };
            this.gestionProyectoApiClient.crearProyecto(dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proyecto creado correctamente.' });
                    this.cerrarDialog();
                },
                error: (err) => {
                    const detail = err.error?.statusCode >= 400 && err.error?.statusCode < 500
                        ? err.error.message
                        : "Error al crear el proyecto";
                    this.messageService.add({ severity: 'error', summary: 'Error', detail });
                }
            });
        }
    }

}