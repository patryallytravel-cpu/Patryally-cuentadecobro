"use client";

import { useRef, useState } from "react";
import SignatureCanvas from "react-signature-canvas";
import type { CuentaCobroData, EstiloFirma, ModoFirma } from "@/lib/types";

interface Props {
  data: CuentaCobroData;
  onChange: (patch: Partial<CuentaCobroData>) => void;
}

const MODOS: { id: ModoFirma; label: string }[] = [
  { id: "escribir", label: "Escribir" },
  { id: "dibujar", label: "Dibujar" },
  { id: "subir", label: "Subir imagen" },
];

const ESTILOS: { id: EstiloFirma; label: string; className: string }[] = [
  { id: "alex-brush", label: "Alex Brush", className: "font-signature-alex" },
  { id: "allura", label: "Allura", className: "font-signature-allura" },
  {
    id: "dancing-script",
    label: "Dancing Script",
    className: "font-signature-dancing",
  },
];

export default function FirmaCampo({ data, onChange }: Props) {
  const sigPadRef = useRef<SignatureCanvas>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorArchivo, setErrorArchivo] = useState("");

  function limpiarDibujo() {
    sigPadRef.current?.clear();
    onChange({ firmaDibujo: null });
  }

  function guardarTrazo() {
    if (!sigPadRef.current || sigPadRef.current.isEmpty()) {
      onChange({ firmaDibujo: null });
      return;
    }
    try {
      const dataUrl = sigPadRef.current
        .getTrimmedCanvas()
        .toDataURL("image/png");
      onChange({ firmaDibujo: dataUrl });
    } catch {
      const dataUrl = sigPadRef.current.toDataURL("image/png");
      onChange({ firmaDibujo: dataUrl });
    }
  }

  function manejarArchivo(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setErrorArchivo("");
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
      setErrorArchivo("Sube una imagen PNG, JPG o WEBP.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      setErrorArchivo("La imagen debe pesar menos de 3 MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      onChange({ firmaImagen: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      {/* Selector de modo */}
      <div className="inline-flex rounded-lg bg-patry-violet-soft p-1 gap-1 mb-4">
        {MODOS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onChange({ modoFirma: m.id })}
            className={`px-3.5 py-1.5 rounded-md text-[0.82rem] font-semibold transition-colors ${
              data.modoFirma === m.id
                ? "bg-white text-patry-violet-deep shadow-soft"
                : "text-patry-violet/70 hover:text-patry-violet-deep"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Escribir */}
      {data.modoFirma === "escribir" && (
        <div className="space-y-3">
          <input
            type="text"
            className="f-input"
            placeholder="Escribe tu firma (ej: tu nombre completo)"
            value={data.firmaTexto}
            onChange={(e) => onChange({ firmaTexto: e.target.value })}
            maxLength={60}
          />
          <div className="flex flex-wrap gap-2">
            {ESTILOS.map((estilo) => (
              <button
                key={estilo.id}
                type="button"
                onClick={() => onChange({ firmaEstilo: estilo.id })}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                  data.firmaEstilo === estilo.id
                    ? "border-patry-violet bg-patry-violet-soft text-patry-violet-deep"
                    : "border-patry-violet-soft text-patry-ink/60 hover:border-patry-violet/40"
                }`}
              >
                {estilo.label}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-dashed border-patry-violet-soft bg-white px-4 py-5 flex items-center justify-center min-h-[92px]">
            <p
              className={`text-[2.1rem] leading-none text-patry-ink ${
                ESTILOS.find((s) => s.id === data.firmaEstilo)?.className
              }`}
            >
              {data.firmaTexto || "Tu firma aquí"}
            </p>
          </div>
        </div>
      )}

      {/* Dibujar */}
      {data.modoFirma === "dibujar" && (
        <div className="space-y-3">
          <div className="rounded-xl border border-dashed border-patry-violet-soft bg-white overflow-hidden touch-none">
            <SignatureCanvas
              ref={sigPadRef}
              penColor="#1A1523"
              canvasProps={{
                className: "w-full h-[160px] cursor-crosshair",
              }}
              onEnd={guardarTrazo}
            />
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-patry-ink/50">
              Dibuja con el mouse o el dedo en pantallas táctiles.
            </p>
            <button
              type="button"
              onClick={limpiarDibujo}
              className="text-xs font-semibold text-patry-violet hover:text-patry-violet-deep"
            >
              Borrar trazo
            </button>
          </div>
        </div>
      )}

      {/* Subir */}
      {data.modoFirma === "subir" && (
        <div className="space-y-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
            className="rounded-xl border border-dashed border-patry-violet-soft bg-white px-4 py-6 flex flex-col items-center justify-center gap-2 min-h-[120px] cursor-pointer hover:border-patry-violet/50 transition-colors"
          >
            {data.firmaImagen ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={data.firmaImagen}
                alt="Firma subida"
                className="max-h-[90px] object-contain"
              />
            ) : (
              <>
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 16V4M12 4L7 9M12 4l5 5"
                    stroke="#4913C2"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                    stroke="#4913C2"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="text-sm text-patry-ink/60 text-center">
                  Arrastra o haz clic para subir tu firma
                  <br />
                  <span className="text-xs text-patry-ink/40">
                    PNG con fondo transparente recomendado
                  </span>
                </p>
              </>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={manejarArchivo}
          />
          <div className="flex items-center gap-3">
            {data.firmaImagen && (
              <button
                type="button"
                onClick={() => onChange({ firmaImagen: null })}
                className="text-xs font-semibold text-patry-violet hover:text-patry-violet-deep"
              >
                Quitar imagen
              </button>
            )}
            {errorArchivo && <p className="f-hint mt-0">{errorArchivo}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
