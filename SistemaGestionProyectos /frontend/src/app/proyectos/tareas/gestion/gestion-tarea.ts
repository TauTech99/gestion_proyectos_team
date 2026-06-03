import { Component, computed, effect, inject, input, InputSignal, model, ModelSignal, Signal, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { MessageService } from "primeng/api";
import { ButtonModule } from "primeng/button";
import { GestionTareaApiClient } from "./gestion-tarea-api-client";
import { CreateTareaDTO } from "./create-tarea-dto";
import { UpdateTareaDTO } from "./update-tarea-dto";
import { EstadosTareasEnum } from "../estados-tareas-enum";
import { ListTareaDTO } from "../listado/list-tarea-dto";

@Component({
    selector: "app-gestion-tarea",
    templateUrl: "./gestion-tarea.html",
    styleUrls: ["./gestion-tarea.css"],
    imports: [DialogModule, InputTextModule, SelectModule, ButtonModule, ReactiveFormsModule]
})
export class GestionTarea {

    visible: ModelSignal<boolean> = model(false);
    tareaSeleccionada: ModelSignal<ListTareaDTO | null> = model<ListTareaDTO | null>(null);

    // InputSignal — solo recibe el id del proyecto desde el padre, no necesita two-way
    readonly idProyecto: InputSignal<number | null> = input<number | null>(null);

    readonly estados: WritableSignal<string[]> = signal(Object.values(EstadosTareasEnum));
    private readonly messageService: MessageService = inject(MessageService);
    private readonly gestionTareaApiClient = inject(GestionTareaApiClient);

    header: Signal<string> = computed(() => {
        return this.tareaSeleccionada() ? "Editar tarea" : "Crear tarea";
    });

    readonly form: FormGroup = new FormGroup({
        descripcion: new FormControl("", [Validators.required]),
        estado: new FormControl(null)
    });

    constructor() {
        effect(() => {
            if (this.visible()) {
                const tarea = this.tareaSeleccionada();
                if (tarea) {
                    this.form.patchValue({
                        descripcion: tarea.descripcion,
                        estado: tarea.estado
                    });
                } else {
                    this.form.reset({ descripcion: "", estado: null });
                }
            }
        });
    }

    cerrarDialog(): void {
        this.tareaSeleccionada.set(null);
        this.form.reset({ descripcion: "", estado: null });
        this.visible.set(false);
    }

    guardarTarea(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Complete todos los campos requeridos.' });
            return;
        }

        const formRawValue = this.form.getRawValue();
        const idProyecto = this.idProyecto();

        if (!idProyecto) return;

        if (this.tareaSeleccionada()) {
            const dto: UpdateTareaDTO = {
                descripcion: formRawValue.descripcion,
                estado: formRawValue.estado
            };
            this.gestionTareaApiClient.actualizarTarea(idProyecto, this.tareaSeleccionada()?.id!, dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarea actualizada correctamente.' });
                    this.cerrarDialog();
                },
                error: (err) => {
                    const detail = err.error?.statusCode >= 400 && err.error?.statusCode < 500
                        ? err.error.message
                        : "Error al actualizar la tarea";
                    this.messageService.add({ severity: 'error', summary: 'Error', detail });
                }
            });
        } else {
            const dto: CreateTareaDTO = { descripcion: formRawValue.descripcion };
            this.gestionTareaApiClient.crearTarea(idProyecto, dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Tarea creada correctamente.' });
                    this.cerrarDialog();
                },
                error: (err) => {
                    const detail = err.error?.statusCode >= 400 && err.error?.statusCode < 500
                        ? err.error.message
                        : "Error al crear la tarea";
                    this.messageService.add({ severity: 'error', summary: 'Error', detail });
                }
            });
        }
    }

}
