import { Component, computed, effect, inject, model, ModelSignal, Signal, signal, WritableSignal } from "@angular/core";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { DialogModule } from "primeng/dialog";
import { EstadosProyectosEnum } from "../estados-proyectos-enum";
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { ListProyectoDTO } from "../listado/list-proyecto-dto";
import { MessageService } from "primeng/api";
import { GestionProyectoApiClient } from "./gestion-proyecto-api-client";
import { CreateProyectoDTO } from "./create-proyecto-dto";
import { ButtonModule } from "primeng/button";
import { UpdateProyectoDto } from "./update-proyecto-dto";
import { ListClienteDTO } from "../clientes/listado/list-cliente-dto";
import { ClientesListadoApiClient } from "../clientes/listado/clientes-listado-api-client";
import { ClientesListado } from "../clientes/listado/clientes-listado";
import { EstadosClientesEnum } from "../clientes/estados-clientes-enum";
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
    selector: "app-gestion-proyecto",
    templateUrl: "./gestion-proyecto.html",
    styleUrls: ["./gestion-proyecto.css"],
    imports: [DialogModule, InputTextModule, SelectModule, DatePickerModule, ButtonModule, ReactiveFormsModule, ClientesListado, NgSelectModule]
})
export class GestionProyecto {

    visible: ModelSignal<boolean> = model(false);

    readonly dialogClientesVisible: WritableSignal<boolean> = signal<boolean>(false);

    proyectoSeleccionado: ModelSignal<ListProyectoDTO | null> = model<ListProyectoDTO | null>(null);

    readonly estados: WritableSignal<string[]> = signal(Object.values(EstadosProyectosEnum));

    private readonly messageService: MessageService = inject(MessageService);

    private readonly gestionProyectoApiClient = inject(GestionProyectoApiClient);

    readonly clientes: WritableSignal<ListClienteDTO[]> = signal<ListClienteDTO[]>([]);

    private readonly clientesListadoApiClient: ClientesListadoApiClient = inject(ClientesListadoApiClient);

    readonly fechaFinEsPasada: WritableSignal<boolean> = signal(false);

    header: Signal<string> = computed(() => {
        if (this.proyectoSeleccionado()) {
            return "Editar proyecto";
        }
        return "Crear proyecto";
    });

    readonly form: FormGroup = new FormGroup({
        nombre: new FormControl("", [Validators.required]),
        cliente: new FormControl(null),
        fechaFin: new FormControl<Date | null>(null),
        estado: new FormControl(null)
    });

    constructor() {
        effect(() => {
            if (this.proyectoSeleccionado()) {
                this.form.patchValue({
                    nombre: this.proyectoSeleccionado()?.nombre,
                    cliente: this.proyectoSeleccionado()?.cliente,
                    fechaFin: this.parsearFechaIso(this.proyectoSeleccionado()?.fechaFin ?? null),
                    estado: this.proyectoSeleccionado()?.estado
                });
            }
            else {
                this.form.reset({
                    nombre: "",
                    cliente: null,
                    fechaFin: null,
                    estado: EstadosProyectosEnum.ACTIVO
                });
            }
        });

        effect(() => {
            if (!this.dialogClientesVisible()) {
                this.refrescarClientes();
            }
        });

        this.form.controls['estado'].valueChanges.subscribe((estado) => {
            this.aplicarValidacionFechaFin(estado);
        });

        this.form.controls['fechaFin'].valueChanges.subscribe((valor: Date | null) => {
            this.fechaFinEsPasada.set(this.esFechaPasada(valor));
        });

    }

    ngOnInit(): void {
        this.refrescarClientes();
    }

    refrescarClientes(): void {
        this.clientesListadoApiClient.buscarClientes(EstadosClientesEnum.ACTIVO).subscribe({
            next: (data) => {
                this.clientes.set(data);
            },
            error: (error) => {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los clientes' });
            }
        });
    }

    cerrarDialog(): void {
        this.proyectoSeleccionado.set(null);
        this.fechaFinEsPasada.set(false);
        this.visible.set(false);
    }

    guardarProyecto(): void {
        if (!this.form.valid) {
            this.form.markAllAsTouched();
            this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Por favor, complete todos los campos requeridos.' });
            return;
        }

        const formRawValue = this.form.getRawValue();

        const fechaFinIso: string | null = this.formatearFechaIso(formRawValue.fechaFin);

        if (this.proyectoSeleccionado()) {
            const dto: UpdateProyectoDto = {
                nombre: formRawValue.nombre,
                idCliente: formRawValue.cliente ? formRawValue.cliente.id : null,
                fechaFin: fechaFinIso,
                estado: formRawValue.estado
            };
            this.gestionProyectoApiClient.actualizarProyecto(this.proyectoSeleccionado()?.id!, dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proyecto actualizado correctamente.' });
                    this.cerrarDialog();
                },
                error: (err) => {
                    let detail: string = "";
                    if (err.error.statusCode >= 400 && err.error.statusCode < 500) {
                        detail = err.error.message
                    }
                    else {
                        detail = "Ha ocurrido un error al actualizar el proyecto"
                    }
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
                }
            });
        } else {
            const dto: CreateProyectoDTO = {
                nombre: formRawValue.nombre,
                idCliente: formRawValue.cliente ? formRawValue.cliente.id : null,
                fechaFin: fechaFinIso
            };
            this.gestionProyectoApiClient.crearProyecto(dto).subscribe({
                next: () => {
                    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Proyecto creado correctamente.' });
                    this.cerrarDialog();
                },
                error: (err) => {
                    let detail: string = "";
                    if (err.error.statusCode >= 400 && err.error.statusCode < 500) {
                        detail = err.error.message
                    }
                    else {
                        detail = "Ha ocurrido un error al crear el proyecto"
                    }
                    this.messageService.add({ severity: 'error', summary: 'Error', detail: detail });
                }
            });
        }
    }

    gestionarClientes(): void {
        this.dialogClientesVisible.set(true);
    }

    private aplicarValidacionFechaFin(estado: EstadosProyectosEnum | null): void {
        const fechaFinCtrl = this.form.controls['fechaFin'];
        if (estado === EstadosProyectosEnum.FINALIZADO) {
            fechaFinCtrl.addValidators(Validators.required);
        } else {
            fechaFinCtrl.removeValidators(Validators.required);
        }
        fechaFinCtrl.updateValueAndValidity({ emitEvent: false });
    }

    private esFechaPasada(fecha: Date | null): boolean {
        if (!fecha) {
            return false;
        }
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const fechaSinHora = new Date(fecha);
        fechaSinHora.setHours(0, 0, 0, 0);
        return fechaSinHora.getTime() < hoy.getTime();
    }

    private parsearFechaIso(iso: string | null): Date | null {
        if (!iso) {
            return null;
        }
        const partes = iso.split('-');
        if (partes.length !== 3) {
            return null;
        }
        const anio = Number(partes[0]);
        const mes = Number(partes[1]);
        const dia = Number(partes[2]);
        if (!Number.isInteger(anio) || !Number.isInteger(mes) || !Number.isInteger(dia)) {
            return null;
        }
        return new Date(anio, mes - 1, dia);
    }

    private formatearFechaIso(fecha: Date | null): string | null {
        if (!fecha) {
            return null;
        }
        const anio = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const dia = String(fecha.getDate()).padStart(2, '0');
        return `${anio}-${mes}-${dia}`;
    }

}
