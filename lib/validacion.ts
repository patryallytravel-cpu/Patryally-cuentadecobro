import type { CuentaCobroData } from "./types";

export function validarCuentaCobro(data: CuentaCobroData): Record<string, string> {
  const errores: Record<string, string> = {};

  if (!data.nombreCompleto.trim())
    errores.nombreCompleto = "Escribe tu nombre completo.";
  if (!data.numeroDocumento.trim())
    errores.numeroDocumento = "Escribe tu número de documento.";
  if (!data.celular.trim()) errores.celular = "Escribe un número de contacto.";
  if (!data.concepto.trim())
    errores.concepto = "Describe el servicio prestado.";
  if (!data.valor || Number(data.valor) <= 0)
    errores.valor = "Ingresa un valor mayor a cero.";
  if (!data.banco.trim()) errores.banco = "Escribe el banco o billetera.";
  if (!data.numeroCuentaBancaria.trim())
    errores.numeroCuentaBancaria = "Escribe el número de cuenta.";
  if (!tieneFirma(data)) errores.firma = "Agrega tu firma para continuar.";

  return errores;
}

export function tieneFirma(data: CuentaCobroData): boolean {
  if (data.modoFirma === "escribir") return !!data.firmaTexto.trim();
  if (data.modoFirma === "dibujar") return !!data.firmaDibujo;
  if (data.modoFirma === "subir") return !!data.firmaImagen;
  return false;
}
