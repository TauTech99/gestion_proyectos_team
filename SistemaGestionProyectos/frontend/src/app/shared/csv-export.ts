/**
 * Helper reutilizable para exportar datos a CSV desde el frontend.
 *
 * - Separador: punto y coma (`;`), pensado para que Excel en español abra
 *   las columnas correctamente sin pasar por el asistente de importación.
 * - Antepone un BOM UTF-8 para que los acentos se muestren bien en Excel.
 * - Cada valor que contenga el separador, comillas o saltos de línea se
 *   encierra entre comillas dobles (y las comillas internas se duplican).
 */

export interface ColumnaCsv<T> {
  encabezado: string;
  valor: (fila: T) => string | number | null | undefined;
}

const SEPARADOR = ';';

function escaparValor(valor: string | number | null | undefined): string {
  const texto = valor === null || valor === undefined ? '' : String(valor);
  if (texto.includes(SEPARADOR) || texto.includes('"') || texto.includes('\n') || texto.includes('\r')) {
    return '"' + texto.replace(/"/g, '""') + '"';
  }
  return texto;
}

export function exportarCsv<T>(nombreArchivo: string, columnas: ColumnaCsv<T>[], filas: T[]): void {
  const encabezados = columnas.map((columna) => escaparValor(columna.encabezado)).join(SEPARADOR);
  const lineas = filas.map((fila) =>
    columnas.map((columna) => escaparValor(columna.valor(fila))).join(SEPARADOR),
  );
  const contenido = [encabezados, ...lineas].join('\r\n');

  const bom = '\uFEFF';
  const blob = new Blob([bom + contenido], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombreArchivo;
  enlace.click();

  URL.revokeObjectURL(url);
}

/** Devuelve la fecha de hoy como `YYYY-MM-DD` para usar en nombres de archivo. */
export function fechaHoyParaArchivo(): string {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, '0');
  const dia = String(hoy.getDate()).padStart(2, '0');
  return `${anio}-${mes}-${dia}`;
}
