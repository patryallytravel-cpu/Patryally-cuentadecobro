// Conversor de números a letras para pesos colombianos (M/CTE)
// Maneja apócope de "uno" -> "un" y la regla de "de pesos" en millones exactos.

const UNIDADES = [
  "",
  "uno",
  "dos",
  "tres",
  "cuatro",
  "cinco",
  "seis",
  "siete",
  "ocho",
  "nueve",
];
const ESPECIALES_10_19 = [
  "diez",
  "once",
  "doce",
  "trece",
  "catorce",
  "quince",
  "dieciséis",
  "diecisiete",
  "dieciocho",
  "diecinueve",
];
const VEINTIS = [
  "veinte",
  "veintiuno",
  "veintidós",
  "veintitrés",
  "veinticuatro",
  "veinticinco",
  "veintiséis",
  "veintisiete",
  "veintiocho",
  "veintinueve",
];
const DECENAS = [
  "",
  "",
  "veinte",
  "treinta",
  "cuarenta",
  "cincuenta",
  "sesenta",
  "setenta",
  "ochenta",
  "noventa",
];
const CENTENAS = [
  "",
  "ciento",
  "doscientos",
  "trescientos",
  "cuatrocientos",
  "quinientos",
  "seiscientos",
  "setecientos",
  "ochocientos",
  "novecientos",
];

function convertirGrupo(n: number, apocope: boolean): string {
  if (n === 0) return "";
  if (n === 100) return "cien";

  const centena = Math.floor(n / 100);
  const resto = n % 100;
  const partes: string[] = [];

  if (centena > 0) partes.push(CENTENAS[centena]);

  if (resto > 0) {
    if (resto === 1) {
      partes.push(apocope ? "un" : "uno");
    } else if (resto < 10) {
      partes.push(UNIDADES[resto]);
    } else if (resto < 20) {
      partes.push(ESPECIALES_10_19[resto - 10]);
    } else if (resto < 30) {
      partes.push(resto === 21 && apocope ? "veintiún" : VEINTIS[resto - 20]);
    } else {
      const dec = Math.floor(resto / 10);
      const uni = resto % 10;
      if (uni === 0) partes.push(DECENAS[dec]);
      else if (uni === 1)
        partes.push(DECENAS[dec] + " y " + (apocope ? "un" : "uno"));
      else partes.push(DECENAS[dec] + " y " + UNIDADES[uni]);
    }
  }

  return partes.join(" ");
}

export function numeroALetras(numeroOriginal: number): string {
  const numero = Math.floor(Math.abs(numeroOriginal));
  if (numero === 0) return "cero";
  if (numero >= 1_000_000_000_000) return "monto demasiado grande";

  const milesMillones = Math.floor(numero / 1_000_000_000);
  const millones = Math.floor((numero % 1_000_000_000) / 1_000_000);
  const miles = Math.floor((numero % 1_000_000) / 1000);
  const cientos = numero % 1000;

  const partes: string[] = [];

  if (milesMillones > 0) {
    partes.push(
      milesMillones === 1
        ? "mil millones"
        : convertirGrupo(milesMillones, true) + " mil millones"
    );
  }
  if (millones > 0) {
    partes.push(
      millones === 1 ? "un millón" : convertirGrupo(millones, true) + " millones"
    );
  }
  if (miles > 0) {
    partes.push(
      miles === 1 ? "mil" : convertirGrupo(miles, true) + " mil"
    );
  }
  if (cientos > 0) {
    partes.push(convertirGrupo(cientos, true));
  }

  return partes.join(" ");
}

/**
 * Convierte un valor numérico a la frase legal en mayúsculas usada en la
 * cuenta de cobro, ej: 1500000 -> "UN MILLÓN QUINIENTOS MIL PESOS M/CTE"
 */
export function valorEnPesosLetras(valor: number): string {
  const n = Math.round(Number(valor) || 0);
  if (n === 0) return "CERO PESOS M/CTE";

  const letras = numeroALetras(n);
  const esExactoMillones = n % 1_000_000 === 0 && n >= 1_000_000;
  const unidadPeso = n === 1 ? "PESO" : "PESOS";

  return `${letras.toUpperCase()}${esExactoMillones ? " DE" : ""} ${unidadPeso} M/CTE`;
}

/** Formatea un número entero con separador de miles al estilo colombiano: 1.500.000 */
export function formatearMiles(valor: number | string): string {
  const n = typeof valor === "string" ? Number(valor.replace(/\D/g, "")) : valor;
  if (!n || isNaN(n)) return "";
  return Math.round(n).toLocaleString("es-CO");
}

/** Extrae solo dígitos de un string (para inputs de dinero) */
export function soloDigitos(valor: string): string {
  return valor.replace(/\D/g, "");
}
