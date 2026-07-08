const MESES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
];

/** yyyy-mm-dd -> "8 de julio de 2026" */
export function formatearFechaLarga(fechaISO: string): string {
  if (!fechaISO) return "____________";
  const [y, m, d] = fechaISO.split("-").map(Number);
  if (!y || !m || !d) return fechaISO;
  return `${d} de ${MESES[m - 1]} de ${y}`;
}
