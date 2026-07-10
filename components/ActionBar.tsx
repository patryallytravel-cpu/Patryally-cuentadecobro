"use client";

import { useState, type RefObject } from "react";
import type { CuentaCobroData } from "@/lib/types";
import { descargarPdf, obtenerPdfBase64, nombreArchivoPdf } from "@/lib/generarPdf";
import { DESTINATARIOS_CORREO } from "@/lib/types";

type Estado = "idle" | "cargando" | "listo" | "error";

interface Props {
  data: CuentaCobroData;
  previewRef: RefObject<HTMLDivElement>;
  onValidar: () => boolean;
  onLimpiar: () => void;
}

export default function ActionBar({ data, previewRef, onValidar, onLimpiar }: Props) {
  const [estadoPdf, setEstadoPdf] = useState<Estado>("idle");
  const [estadoCorreo, setEstadoCorreo] = useState<Estado>("idle");
  const [mensaje, setMensaje] = useState("");
  const [confirmarLimpiar, setConfirmarLimpiar] = useState(false);

  async function handleDescargar() {
    setMensaje("");
    if (!onValidar()) {
      setMensaje("Revisa los campos resaltados en el formulario antes de continuar.");
      return;
    }
    if (!previewRef.current) return;

    setEstadoPdf("cargando");
    try {
      await descargarPdf(previewRef.current, data);
      setEstadoPdf("listo");
      setTimeout(() => setEstadoPdf("idle"), 2500);
    } catch {
      setEstadoPdf("error");
      setMensaje("No se pudo generar el PDF. Intenta de nuevo.");
    }
  }

  async function handleEnviar() {
    setMensaje("");
    if (!onValidar()) {
      setMensaje("Revisa los campos resaltados en el formulario antes de continuar.");
      return;
    }
    if (!previewRef.current) return;

    setEstadoCorreo("cargando");
    try {
      const pdfBase64 = await obtenerPdfBase64(previewRef.current);

      const { firmaImagen, firmaDibujo, ...datosLivianos } = data;


      const respuesta = await fetch("/api/enviar-correo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: datosLivianos,
          pdfBase64,
          nombreArchivo: nombreArchivoPdf(data),
        }),
      });
      const json = await respuesta.json().catch(() => ({}));
      if (!respuesta.ok || !json.ok) {
        throw new Error(json.error || "El servidor no pudo enviar el correo.");
      }
      setEstadoCorreo("listo");
    } catch (err) {
      setEstadoCorreo("error");
      setMensaje(
        err instanceof Error
          ? err.message
          : "No se pudo enviar el correo. Descarga el PDF y envíalo manualmente mientras tanto."
      );
    }
  }

  function handleLimpiar() {
    if (!confirmarLimpiar) {
      setConfirmarLimpiar(true);
      setTimeout(() => setConfirmarLimpiar(false), 3000);
      return;
    }
    onLimpiar();
    setConfirmarLimpiar(false);
    setEstadoPdf("idle");
    setEstadoCorreo("idle");
    setMensaje("");
  }

  return (
    <div className="sticky bottom-0 mt-6 bg-patry-paper/95 backdrop-blur border-t border-patry-violet-soft pt-4 pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:bg-transparent sm:backdrop-blur-0 sm:border-0 sm:static">
      {mensaje && (
        <p className="text-xs text-[#B23A3A] bg-[#FDF4F4] border border-[#F2D6D6] rounded-lg px-3 py-2 mb-3">
          {mensaje}
        </p>
      )}

      {estadoCorreo === "listo" && (
        <p className="text-xs text-[#2F7A4F] bg-[#F0F9F3] border border-[#CFE9D8] rounded-lg px-3 py-2 mb-3">
          Tu cuenta de cobro fue enviada a Patryally. Recibirás confirmación en tu correo si lo indicaste.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-2.5">
        <button
          type="button"
          onClick={handleEnviar}
          disabled={estadoCorreo === "cargando"}
          className="order-1 sm:order-2 flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-violet-gradient text-white font-semibold text-sm py-3.5 px-5 shadow-card hover:brightness-[1.08] active:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {estadoCorreo === "cargando" ? (
            <>
              <Spinner /> Enviando…
            </>
          ) : estadoCorreo === "listo" ? (
            <>
              <CheckIcon /> Enviada
            </>
          ) : (
            <>
              <MailIcon /> Enviar a Patryally
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handleDescargar}
          disabled={estadoPdf === "cargando"}
          className="order-2 sm:order-1 flex-1 inline-flex items-center justify-center gap-2 rounded-xl border-1.5 border-patry-violet text-patry-violet font-semibold text-sm py-3.5 px-5 hover:bg-patry-violet-soft transition disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ borderWidth: "1.5px" }}
        >
          {estadoPdf === "cargando" ? (
            <>
              <Spinner color="#4913C2" /> Generando…
            </>
          ) : estadoPdf === "listo" ? (
            <>
              <CheckIcon color="#4913C2" /> Descargado
            </>
          ) : (
            <>
              <DownloadIcon /> Descargar PDF
            </>
          )}
        </button>
      </div>

      <div className="flex items-center justify-between mt-3">
        <p className="text-[0.68rem] text-patry-ink/40">
          Se enviará a {DESTINATARIOS_CORREO.join(" y ")}
        </p>
        <button
          type="button"
          onClick={handleLimpiar}
          className="text-[0.72rem] font-medium text-patry-ink/40 hover:text-[#B23A3A] transition-colors"
        >
          {confirmarLimpiar ? "¿Confirmar? Toca de nuevo" : "Limpiar todo"}
        </button>
      </div>
    </div>
  );
}

function Spinner({ color = "#fff" }: { color?: string }) {
  return (
    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2.5" opacity="0.25" />
      <path d="M21 12a9 9 0 00-9-9" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
function CheckIcon({ color = "#fff" }: { color?: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M3.5 6.5h17a1 1 0 011 1v9a1 1 0 01-1 1h-17a1 1 0 01-1-1v-9a1 1 0 011-1z"
        stroke="white"
        strokeWidth="1.8"
      />
      <path d="M3 7l9 6.5L21 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function DownloadIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3v12m0 0l-4.5-4.5M12 15l4.5-4.5"
        stroke="#4913C2"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="#4913C2" strokeWidth="1.9" strokeLinecap="round" />
    </svg>
  );
}
