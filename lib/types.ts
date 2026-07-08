export type TipoDocumento = "CC" | "CE" | "PPT" | "Pasaporte" | "NIT";
export type TipoCuentaBancaria = "Ahorros" | "Corriente";
export type ModoFirma = "escribir" | "dibujar" | "subir";
export type EstiloFirma = "alex-brush" | "allura" | "dancing-script";

export interface CuentaCobroData {
  // Datos del documento
  consecutivo: string;
  ciudad: string;
  fecha: string; // yyyy-mm-dd

  // Quien cobra (acreedor / contratista)
  nombreCompleto: string;
  tipoDocumento: TipoDocumento;
  numeroDocumento: string;
  celular: string;
  correoContacto: string;

  // Empresa que paga (deudor) - Patryally por defecto
  empresaNombre: string;
  empresaNit: string;

  // Detalle del cobro
  concepto: string;
  valor: string; // solo dígitos, formateado en UI

  // Declaración tributaria (Art. 383 E.T. / Decreto 1273 de 2014)
  declaranteRenta: boolean;
  contratoOtrosTrabajadores: boolean;
  obligadoFacturar: boolean;

  // Datos de pago
  banco: string;
  tipoCuentaBancaria: TipoCuentaBancaria;
  numeroCuentaBancaria: string;

  // Firma
  modoFirma: ModoFirma;
  firmaTexto: string;
  firmaEstilo: EstiloFirma;
  firmaDibujo: string | null; // dataURL
  firmaImagen: string | null; // dataURL
}

export const EMPRESA_POR_DEFECTO = {
  nombre: "Patry Ally",
  nit: "",
};

export const DESTINATARIOS_CORREO = [
  "Contabilidad.patryally@outlook.com",
  "Patryallytravel@gmail.com",
];

export function crearCuentaCobroVacia(): CuentaCobroData {
  const hoy = new Date();
  const fechaISO = hoy.toISOString().slice(0, 10);

  return {
    consecutivo: "001",
    ciudad: "Medellín",
    fecha: fechaISO,

    nombreCompleto: "",
    tipoDocumento: "CC",
    numeroDocumento: "",
    celular: "",
    correoContacto: "",

    empresaNombre: EMPRESA_POR_DEFECTO.nombre,
    empresaNit: EMPRESA_POR_DEFECTO.nit,

    concepto: "",
    valor: "",

    declaranteRenta: true,
    contratoOtrosTrabajadores: false,
    obligadoFacturar: false,

    banco: "",
    tipoCuentaBancaria: "Ahorros",
    numeroCuentaBancaria: "",

    modoFirma: "escribir",
    firmaTexto: "",
    firmaEstilo: "dancing-script",
    firmaDibujo: null,
    firmaImagen: null,
  };
}
