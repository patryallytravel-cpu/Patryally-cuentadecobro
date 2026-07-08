import type { CuentaCobroData } from "@/lib/types";

async function capturarComoPdf(elemento: HTMLElement) {
  const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ]);

  const canvas = await html2canvas(elemento, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "letter",
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 24;
  const usableWidth = pageWidth - margin * 2;
  const usableHeight = pageHeight - margin * 2;

  let finalWidth = usableWidth;
  let finalHeight = (canvas.height * finalWidth) / canvas.width;

  if (finalHeight > usableHeight) {
    finalHeight = usableHeight;
    finalWidth = (canvas.width * finalHeight) / canvas.height;
  }

  const x = (pageWidth - finalWidth) / 2;
  pdf.addImage(imgData, "PNG", x, margin, finalWidth, finalHeight);

  return pdf;
}

export function nombreArchivoPdf(data: CuentaCobroData): string {
  const base = data.nombreCompleto || "cuenta_de_cobro";
  const limpio = base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return `Cuenta_de_cobro_${limpio || "Patryally"}_${data.fecha || ""}.pdf`;
}

export async function descargarPdf(elemento: HTMLElement, data: CuentaCobroData) {
  const pdf = await capturarComoPdf(elemento);
  pdf.save(nombreArchivoPdf(data));
}

/** Devuelve solo la parte base64 (sin el prefijo data:application/pdf;base64,) */
export async function obtenerPdfBase64(elemento: HTMLElement): Promise<string> {
  const pdf = await capturarComoPdf(elemento);
  const dataUri = pdf.output("datauristring");
  return dataUri.split(",")[1] ?? "";
}
