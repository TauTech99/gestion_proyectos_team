import { Component, computed, effect, inject, model, ModelSignal, Signal, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { EstadosProyectosEnum } from "../estados-proyectos-enum";
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ListProyectoDTO } from '../listado/list-proyecto-dto';
import { MessageService } from 'primeng/api';
import { GestionProyectoApiClient } from './gestion-proyecto-api-client';
import { CreateProyectoDTO } from './create-proyecto-dto';
import { ButtonModule } from 'primeng/button';
import { UpdateProyectoDto } from './update-proyecto-dto';
import { ListClienteDTO } from '../clientes/listado/list-cliente-dto';
import { ClientesListadoApiClient } from '../clientes/listado/clientes-listado-api-client';
import { ClientesListado } from '../clientes/listado/clientes-listado';
import { EstadosClientesEnum } from '../clientes/estados-cliente-enum';
import { NgSelectModule } from "@ng-select/ng-select";

@Component({
    selector: "app-gestion-proyecto",
    templateUrl: "./gestion-proyecto.html",
    styleUrls: ["./gestion-proyecto.css"],
    imports: [DialogModule, InputTextModule, SelectModule, ReactiveFormsModule, ButtonModule, ClientesListado, NgSelectModule]
})

export class GestionProyecto{

    visible: ModelSignal<boolean> = model(false);
    proyectoSeleccionado: ModelSignal<ListProyectoDTO | null> = model<ListProyectoDTO | null>(null);

    readonly dialogClientesVisible: WritableSignal<boolean> = signal<boolean>(false);
    readonly estados: WritableSignal<string[]> = signal(Object.values(EstadosProyectosEnum));
    readonly clientes: WritableSignal<ListClienteDTO[]> = signal<ListClienteDTO[]>([]);

    private readonly messageService: MessageService = inject(MessageService);
    private readonly gestionProyectoApiClient = inject(GestionProyectoApiClient);
    private readonly clientesListadosApiClient: ClientesListadoApiClient = inject(ClientesListadoApiClient);

    header: Signal<string> = computed(() => {
        if(this.proyectoSeleccionado()){
            return "Editar proyecto"
        }
        return "Crear proyecto";
    });

    readonly form: FormGroup = new FormGroup({
        nombre: new FormControl("", [Validators.required]),
        cliente: new FormControl(null),
        estado: new FormControl(null),
        fechaFinalizacionObjetivo: new FormControl(null),
    })

    constructor(){

        effect(() => {
            if(this.proyectoSeleccionado()){
                this.form.patchValue({
                    nombre: this.proyectoSeleccionado()?.nombre,
                    cliente: this.proyectoSeleccionado()?.cliente,
                    estado: this.proyectoSeleccionado()?.estado,
                    fechaFinalizacionObjetivo: this.proyectoSeleccionado()?.fechaFinalizacionObjetivo,
                });
            }
            else{
                this.form.reset({
                    nombre: "",
                    clientes: null,
                    estado: EstadosProyectosEnum.ACTIVO
                });
            }
        })

        effect(() => {
            if(!this.dialogClientesVisible()){
                this.refrescarClientes()
            }
        });
    }

    ngOnInit(): void{
        this.refrescarClientes();
    }

    refrescarClientes(): void{
        this.clientesListadosApiClient.buscarClientes(EstadosClientesEnum.ACTIVO).subscribe({
            next: (data) => {
                this.clientes.set(data);
            },
            error: (err) => {
                this.messageService.add({severity: 'error', summary: 'Error', detail: 'Ocurrió un error al obtener los clientes'});
            }
        })
    }

    cerrarDialog(): void{
        this.proyectoSeleccionado.set(null);
        this.visible.set(false);
    }

    guardarProyecto(): void{
        if(!this.form.valid){
            this.form.markAllAsTouched();
            this.messageService.add({severity: 'error', summary: 'Error', detail: 'Complete todos los campos requeridos'});
            return;
        }

        const formRawValue = this.form.getRawValue();

        if(this.proyectoSeleccionado()){
            const dto: UpdateProyectoDto = {
                nombre: formRawValue.nombre,
                idCliente: formRawValue.cliente ? formRawValue.cliente.id : null,
                estado: formRawValue.estado,
                fechaFinalizacionObjetivo: formRawValue.fechaFinalizacionObjetivo,
            };

            this.gestionProyectoApiClient.actualizarProyecto(this.proyectoSeleccionado()?.id!, dto).subscribe({
                next: () => {
                    this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Proyecto actualizado correctamente'});
                    this.cerrarDialog();
                },
                error: (err) => {
                    let detail: string = "";
                    if (err.error.statusCode >= 400 && err.error.statusCode < 500){
                        detail = err.error.message
                    }
                    else{
                        detail = "Ocurrió un error al actualizar el proyecto"
                    }
                    this.messageService.add({severity: 'error', summary: 'Error', detail: detail});
                }
            })
        } else {
            const dto: CreateProyectoDTO = {
                nombre: formRawValue.nombre,
                idCliente: formRawValue.cliente ? formRawValue.cliente.id : null,
                fechaFinalizacionObjetivo: formRawValue.fechaFinalizacionObjetivo,
            };
            this.gestionProyectoApiClient.crearProyecto(dto).subscribe({
                next: () => {
                    this.messageService.add({severity: 'success', summary: 'Éxito', detail: 'Proyecto creado correctamente'});
                    this.cerrarDialog();
                },
                error: (err) => {
                    let detail: string = "";
                    if (err.error.statusCode >= 400 && err.error.statusCode < 500){
                        detail = err.error.message
                    }
                    else{
                        detail = "Ocurrió un error al crear el proyecto"
                    }
                    this.messageService.add({severity: 'error', summary: 'Error', detail: detail});
                }
            })
        }
    }

    gestionarClientes(): void {
        this.dialogClientesVisible.set(true);
    }
}
