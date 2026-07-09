import { forwardRef } from "react";
import type { CuentaCobroData } from "@/lib/types";
import { formatearMiles, valorEnPesosLetras } from "@/lib/numeroALetras";
import { formatearFechaLarga } from "@/lib/formato";

interface Props {
  data: CuentaCobroData;
}

const ESTILO_CLASE: Record<string, string> = {
  "alex-brush": "font-signature-alex",
  allura: "font-signature-allura",
  "dancing-script": "font-signature-dancing",
};

const CuentaCobroPreview = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const nombre = data.nombreCompleto || "________________________";
  const valorNumerico = Number(data.valor || 0);

  return (
    <div
      ref={ref}
      id="documento-cuenta-cobro"
      className="bg-white text-patry-ink w-full max-w-[700px] mx-auto px-8 py-9 sm:px-11 sm:py-11"
      style={{ fontFamily: "var(--font-jakarta), sans-serif" }}
    >
      {/* Encabezado */}
      <div className="flex items-start justify-between mb-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Patryally" className="h-9 w-auto" />
        <div className="text-right">
          <p className="font-display text-lg text-patry-violet-deep leading-none">
            Cuenta de cobro
          </p>
          <p className="text-xs text-patry-ink/50 mt-1">
            N.° {data.consecutivo || "001"}
          </p>
        </div>
      </div>

      <p className="text-sm mb-7">
        {data.ciudad || "Medellín"}, {formatearFechaLarga(data.fecha)}
      </p>

      {/* Empresa deudora */}
      <div className="mb-6">
        <p className="text-[0.95rem] font-semibold">
          {data.empresaNombre}
        </p>
        {data.empresaNit && (
          <p className="text-xs text-patry-ink/60">NIT: {data.empresaNit}</p>
        )}
      </div>

      {/* Debe a */}
      <div className="mb-6">
        <p className="text-[0.68rem] font-bold tracking-wide text-patry-violet uppercase mb-1">
          Debe a:
        </p>
        <p className="text-[0.95rem] font-semibold">{nombre}</p>
        <p className="text-xs text-patry-ink/60">
          {data.tipoDocumento}. {data.numeroDocumento || "____________"}
        </p>
      </div>

      {/* La suma de */}
      <div className="mb-6">
        <p className="text-[0.68rem] font-bold tracking-wide text-patry-violet uppercase mb-1">
          La suma de:
        </p>
        <p className="text-[0.95rem] font-semibold leading-snug">
          {valorEnPesosLetras(valorNumerico)}
        </p>
        <p className="text-sm text-patry-ink/70">
          ($ {formatearMiles(data.valor) || "0"})
        </p>
      </div>

      {/* Concepto */}
      <div className="mb-7">
        <p className="text-[0.68rem] font-bold tracking-wide text-patry-violet uppercase mb-1">
          Por concepto de:
        </p>
        <p className="text-sm leading-relaxed whitespace-pre-line">
          {data.concepto || "____________________________________"}
        </p>
      </div>

      {/* Declaración tributaria */}
      <div className="mb-8 text-[0.7rem] leading-relaxed text-patry-ink/65 text-justify">
        <p>
          Yo, {nombre}, identificado(a) como aparece al pie de mi firma, como
          persona natural residente en Colombia, dando alcance a lo dispuesto
          en el artículo 17 de la Ley 1819 y en el parágrafo 2 del artículo
          383 del Estatuto Tributario, para efectos de determinar el régimen
          de retención en la fuente que me es aplicable en materia de
          impuesto sobre la renta, me permito informar, de conformidad con el
          artículo 7 del Decreto 19 de 2012, que:
        </p>
        <p className="mt-1.5">
          a) Presto servicios u honorarios de manera personal.
          <br />
          b) Para esta prestación del servicio a ustedes{" "}
          {data.contratoOtrosTrabajadores ? "SÍ" : "NO"} he contratado o
          vinculado dos o más trabajadores o contratistas.
          <br />
          c) {data.obligadoFacturar ? "SÍ" : "NO"} estoy obligado(a) a
          facturar.
        </p>
        <p className="mt-1.5">
          Adicional, confirmo que {data.declaranteRenta ? "SÍ" : "NO"} soy
          persona declarante de renta. Me comprometo a manifestar
          oportunamente cualquier cambio a la información aquí suministrada.
        </p>
      </div>

      <p className="text-sm mb-2">Atentamente,</p>

      {/* Firma */}
      <div className="min-h-[64px] flex items-end mb-1">
        {data.modoFirma === "escribir" && data.firmaTexto && (
          <p
            className={`text-[2rem] leading-none text-patry-ink ${ESTILO_CLASE[data.firmaEstilo]}`}
          >
            {data.firmaTexto}
          </p>
        )}
        {data.modoFirma === "dibujar" && data.firmaDibujo && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.firmaDibujo} alt="Firma" className="h-16 object-contain" />
        )}
        {data.modoFirma === "subir" && data.firmaImagen && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={data.firmaImagen} alt="Firma" className="h-16 object-contain" />
        )}
      </div>
      <div className="w-52 border-t border-patry-ink/30 mb-1" />

      <p className="text-sm font-semibold">{nombre}</p>
      <p className="text-xs text-patry-ink/60">
        {data.tipoDocumento}. {data.numeroDocumento || "____________"}
      </p>
      <p className="text-xs text-patry-ink/60 mb-6">
        Cel: {data.celular || "____________"}
      </p>

      {/* Datos de pago */}
      <div className="rounded-lg bg-patry-violet-soft/60 px-4 py-3.5">
        <p className="text-[0.68rem] font-bold tracking-wide text-patry-violet uppercase mb-1.5">
          Favor consignar a:
        </p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-patry-ink/75">
          <p>
            <span className="text-patry-ink/50">Banco:</span>{" "}
            {data.banco || "____________"}
          </p>
          <p>
            <span className="text-patry-ink/50">Tipo:</span>{" "}
            {data.tipoCuentaBancaria}
          </p>
          <p className="col-span-2">
            <span className="text-patry-ink/50">N.° de cuenta:</span>{" "}
            {data.numeroCuentaBancaria || "____________"}
          </p>
        </div>
      </div>
    </div>
  );
});

CuentaCobroPreview.displayName = "CuentaCobroPreview";
export default CuentaCobroPreview;
