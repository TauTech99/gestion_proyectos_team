import { Component, computed, effect, inject, input, InputSignal, model, ModelSignal, Signal, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { UpdateClienteDto } from "./update-cliente-dto";
import { EstadosClientesEnum } from "../estados-clientes-enum";
import { GestionClienteApiClient } from "./gestion-cliente-api-client";
import { CreateClienteDTO } from "./create-cliente-dto";
import { ListClienteDTO } from "../listado/list-cliente-dto";

@Component({
    selector: "app-gestion-cliente",
    templateUrl: "./gestion-cliente.html",
    styleUrls: ["./gestion-cliente.css"],
    imports: [DialogModule, InputTextModule, SelectModule, ButtonModule, ReactiveFormsModule]
})
export class GestionCliente {

    visible: ModelSignal<boolean> = model(false);

    clienteSeleccionado: ModelSignal<ListClienteDTO | null> = model<ListClienteDTO | null>(null);

    readonly estados: WritableSignal<string[]> = signal(Object.values(EstadosClientesEnum));

    private readonly messageService: MessageService = inject(MessageService);

    private readonly gestionClienteApiClient = inject(GestionClienteApiClient);

    readonly idProyecto: InputSignal<number | null> = input<number | null>(null);

    header: Signal<string> = computed(() => {
        if (this.clienteSeleccionado()) {
            return "Editar cliente";
        }
        return "Crear cliente";
    });

    readonly form: FormGroup = new FormGroup({
        nombre: new FormControl("", [Validators.required]),
        telefono: new FormControl(""),
        email: new FormControl("", [Validators.email]),
        estado: new FormControl(null)
    });

    constructor() {
        effect(() => {
            if (this.clienteSeleccionado()) {
                this.form.patchValue({
                    nombre: this.clienteSeleccionado()?.nombre,
                    telefono: this.clienteSeleccionado()?.telefono ?? "",
                    email: this.clienteSeleccionado()?.email ?? "",
                    estado: this.clienteSeleccionado()?.estado
                });
            }
            else {
                this.form.reset({
                    nombre: "",
                    telefono: "",
                    email: "",
                    estado: null
                });
            }
        });
    }

    cerrarDialog(): void {
        this.clienteSeleccionado.set(null);
        this.form.reset({
            nombre: "",
            telefono: "",
            email: "",
            estado: null
        });
        this.visible.set(false);
    }

    guardarCliente(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos requeridos.' });
            return;
        }

        const formRawValue = this.form.getRawValue();

        if (this.clienteSeleccionado()) {
            const dto: UpdateClienteDto = {
                nombre: formRawValue.nombre,
                telefono: formRawValue.telefono?.trim() ? formRawValue.telefono.trim() : null,
                email: formRawValue.email?.trim() ? formRawValue.email.trim() : null,
                estado: formRawValue.estado
            };
            this.gestionClienteApiClient.actualizarCliente(this.clienteSeleccionado()?.id!, dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente actualizado correctamente.' });
                    this.cerrarDialog();
                },
                error: (err) => {
                    let detail: string = "";
                    if (err.error.statusCode >= 400 && err.error.statusCode < 500) {
                        detail = err.error.message
                    }
                    else {
                        detail = "Ha ocurrido un error al actualizar el cliente"
                    }
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
                }
            });
        } else {
            const dto: CreateClienteDTO = {
                nombre: formRawValue.nombre,
                telefono: formRawValue.telefono?.trim() ? formRawValue.telefono.trim() : null,
                email: formRawValue.email?.trim() ? formRawValue.email.trim() : null
            };
            this.gestionClienteApiClient.crearCliente(dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Cliente creado correctamente.' });
                    this.cerrarDialog();
                },
                error: (err) => {
                    let detail: string = "";
                    if (err.error.statusCode >= 400 && err.error.statusCode < 500) {
                        detail = err.error.message
                    }
                    else {
                        detail = "Ha ocurrido un error al crear el cliente"
                    }
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
                }
            });
        }
    }

}