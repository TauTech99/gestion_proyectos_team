import { Component, effect, inject, model, ModelSignal, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { TableModule } from 'primeng/table';
import { ButtonModule } from "primeng/button";
import { ClientesListadoApiClient } from "./clientes-listado-api-client";
import { ListClienteDTO } from "./list-cliente-dto";
import { DialogModule } from "primeng/dialog";
import { TooltipModule } from "primeng/tooltip";
import { GestionCliente } from "../gestion/gestion-cliente";

@Component({
  selector: "app-clientes-listado",
  templateUrl: "./clientes-listado.html",
  styleUrls: ["./clientes-listado.css"],
  imports: [TableModule, ButtonModule, DialogModule, TooltipModule, GestionCliente]
})
export class ClientesListado implements OnInit {

  private readonly messageService: MessageService = inject(MessageService);

  visible: ModelSignal<boolean> = model(false);

  private readonly clientesListadoApiClient: ClientesListadoApiClient = inject(ClientesListadoApiClient);

  clientes: WritableSignal<ListClienteDTO[]> = signal([]);

  dialogVisible: WritableSignal<boolean> = signal(false);

  clienteSeleccionado: WritableSignal<ListClienteDTO | null> = signal<ListClienteDTO | null>(null);

  constructor() {
    effect(() => {
      if (!this.dialogVisible()) {
        this.refrescarClientes();
      }
    });
  }

  ngOnInit(): void {
    this.refrescarClientes();
  }

  refrescarClientes(): void {
    this.clientesListadoApiClient.buscarClientes().subscribe({
      next: (data) => {
        this.clientes.set(data);
      },
      error: (error) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al obtener los clientes' });
      }
    });
  }

  crearCliente(): void {
    this.dialogVisible.set(true);
  }

  editarCliente(cliente: ListClienteDTO): void {
    this.dialogVisible.set(true);
    this.clienteSeleccionado.set(cliente);
  }

}