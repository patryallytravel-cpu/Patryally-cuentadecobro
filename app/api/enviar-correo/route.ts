import { NextResponse } from "next/server";
import { Resend } from "resend";
import type { CuentaCobroData } from "@/lib/types";
import { DESTINATARIOS_CORREO } from "@/lib/types";
import { formatearMiles, valorEnPesosLetras } from "@/lib/numeroALetras";
import { formatearFechaLarga } from "@/lib/formato";

export const runtime = "nodejs";

function escapeHtml(valor: string): string {
  return String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = body?.data as CuentaCobroData | undefined;
    const pdfBase64 = body?.pdfBase64 as string | undefined;
    const nombreArchivo = (body?.nombreArchivo as string) || "cuenta-de-cobro.pdf";

    if (!data || !pdfBase64) {
      return NextResponse.json(
        { ok: false, error: "Faltan datos de la cuenta de cobro." },
        { status: 400 }
      );
    }
    if (!data.nombreCompleto?.trim() || !data.numeroDocumento?.trim() || !data.valor) {
      return NextResponse.json(
        { ok: false, error: "Completa nombre, documento y valor antes de enviar." },
        { status: 400 }
      );
    }
    // Un PDF de una sola página en base64 no debería superar unos pocos MB.
    if (pdfBase64.length > 8_000_000) {
      return NextResponse.json(
        { ok: false, error: "El archivo generado es demasiado grande." },
        { status: 400 }
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error("Falta configurar RESEND_API_KEY en las variables de entorno.");
      return NextResponse.json(
        {
          ok: false,
          error:
            "El envío por correo aún no está configurado en el servidor. Descarga el PDF y envíalo manualmente mientras tanto.",
        },
        { status: 500 }
      );
    }

    const resend = new Resend(apiKey);

    const emailFrom = process.env.EMAIL_FROM || "Patryally <onboarding@resend.dev>";
    const destinatarios = process.env.EMAIL_TO
      ? process.env.EMAIL_TO.split(",").map((c) => c.trim()).filter(Boolean)
      : DESTINATARIOS_CORREO;

    const valorTexto = valorEnPesosLetras(Number(data.valor || 0));
    const valorNumero = formatearMiles(data.valor);

    const html = `
      <div style="font-family: Arial, Helvetica, sans-serif; color:#1A1523; max-width:560px; margin:0 auto;">
        <p style="font-size:12px; letter-spacing:.08em; text-transform:uppercase; color:#B8935B; font-weight:700; margin:0 0 6px;">Nueva cuenta de cobro</p>
        <h2 style="color:#2E0B85; margin:0 0 18px; font-size:20px;">${escapeHtml(data.nombreCompleto)}</h2>
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <tr><td style="padding:6px 0; color:#6b6280; width:180px;">Documento</td><td style="padding:6px 0;"><strong>${escapeHtml(data.tipoDocumento)} ${escapeHtml(data.numeroDocumento)}</strong></td></tr>
          <tr><td style="padding:6px 0; color:#6b6280;">Celular</td><td style="padding:6px 0;">${escapeHtml(data.celular)}</td></tr>
          ${data.correoContacto ? `<tr><td style="padding:6px 0; color:#6b6280;">Correo</td><td style="padding:6px 0;">${escapeHtml(data.correoContacto)}</td></tr>` : ""}
          <tr><td style="padding:6px 0; color:#6b6280;">Ciudad y fecha</td><td style="padding:6px 0;">${escapeHtml(data.ciudad)}, ${escapeHtml(formatearFechaLarga(data.fecha))}</td></tr>
          <tr><td style="padding:6px 0; color:#6b6280;">N.° cuenta de cobro</td><td style="padding:6px 0;">${escapeHtml(data.consecutivo)}</td></tr>
          <tr><td style="padding:10px 0 4px; color:#6b6280; vertical-align:top;">Concepto</td><td style="padding:10px 0 4px;">${escapeHtml(data.concepto)}</td></tr>
          <tr><td style="padding:6px 0; color:#6b6280;">Valor</td><td style="padding:6px 0;"><strong>$ ${valorNumero}</strong> COP<br/><span style="font-size:12px; color:#6b6280;">${escapeHtml(valorTexto)}</span></td></tr>
        </table>
        <div style="margin-top:18px; padding:12px 14px; background:#F1EBFC; border-radius:10px; font-size:13px;">
          <p style="margin:0 0 4px; color:#4913C2; font-weight:700; font-size:11px; text-transform:uppercase; letter-spacing:.06em;">Datos de pago</p>
          <p style="margin:0;">${escapeHtml(data.banco)} · ${escapeHtml(data.tipoCuentaBancaria)}<br/>N.° ${escapeHtml(data.numeroCuentaBancaria)}</p>
        </div>
        <p style="margin-top:22px; font-size:12px; color:#9a91ad;">El documento formal firmado se adjunta en PDF. Generado automáticamente desde el formulario de cuentas de cobro de Patryally.</p>
      </div>
    `;

    const { error } = await resend.emails.send({
      from: emailFrom,
      to: destinatarios,
      reply_to: data.correoContacto?.trim() || undefined,
      subject: `Cuenta de cobro · ${data.nombreCompleto} · $${valorNumero}`,
      html,
      attachments: [
        {
          filename: nombreArchivo,
          content: pdfBase64,
        },
      ],
    });

    if (error) {
      console.error("Error de Resend:", error);
      return NextResponse.json(
        { ok: false, error: "El proveedor de correo rechazó el envío. Intenta de nuevo." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Error inesperado enviando la cuenta de cobro:", err);
    return NextResponse.json(
      { ok: false, error: "Ocurrió un error inesperado en el servidor." },
      { status: 500 }
    );
  }
}
