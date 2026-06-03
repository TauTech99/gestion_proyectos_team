import { Component, effect, inject, OnInit, signal, WritableSignal } from "@angular/core";
import { MessageService } from "primeng/api";
import { ColumnaCsv, exportarCsv, fechaHoyParaArchivo } from "../../../shared/csv-export";
import { Table, TableModule } from "primeng/table";
import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";
import { InputTextModule } from "primeng/inputtext";
import { SelectModule } from "primeng/select";
import { Template } from "../../../template/template";
import { ListClienteDTO } from "../listado/list-cliente-dto";
import { ClientesListadoApiClient } from "../listado/clientes-listado-api-client";
import { GestionCliente } from "../gestion/gestion-cliente";
import { EstadosClientesEnum } from "../estados-clientes-enum";

@Component({
  selector: "app-clientes-page",
  templateUrl: "./clientes-page.html",
  styleUrls: ["./clientes-page.css"],
  imports: [TableModule, ButtonModule, TooltipModule, InputTextModule, SelectModule, Template, GestionCliente]
})
export class ClientesPage implements OnInit {

  readonly estados: string[] = Object.values(EstadosClientesEnum);

  private readonly messageService: MessageService = inject(MessageService);

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
      error: () => {
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

  exportar(dt: Table): void {
    const filas = (dt.filteredValue ?? this.clientes()) as ListClienteDTO[];
    if (filas.length === 0) {
      this.messageService.add({ severity: 'info', summary: 'Sin datos', detail: 'No hay clientes para exportar' });
      return;
    }
    const columnas: ColumnaCsv<ListClienteDTO>[] = [
      { encabezado: 'Nombre', valor: (c) => c.nombre },
      { encabezado: 'Teléfono', valor: (c) => c.telefono ?? '' },
      { encabezado: 'Email', valor: (c) => c.email ?? '' },
      { encabezado: 'Estado', valor: (c) => c.estado },
    ];
    exportarCsv(`clientes_${fechaHoyParaArchivo()}.csv`, columnas, filas);
  }

}
