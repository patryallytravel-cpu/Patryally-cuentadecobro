"use client";

import { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import CuentaCobroForm from "@/components/CuentaCobroForm";
import CuentaCobroPreview from "@/components/CuentaCobroPreview";
import ActionBar from "@/components/ActionBar";
import { crearCuentaCobroVacia, type CuentaCobroData } from "@/lib/types";
import { validarCuentaCobro } from "@/lib/validacion";

const CLAVE_LOCALSTORAGE = "patryally-cuenta-cobro-v1";

type PestanaMovil = "formulario" | "vista";

export default function Home() {
  const [data, setData] = useState<CuentaCobroData>(crearCuentaCobroVacia());
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [pestanaMovil, setPestanaMovil] = useState<PestanaMovil>("formulario");
  const [cargado, setCargado] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const guardado = localStorage.getItem(CLAVE_LOCALSTORAGE);
      if (guardado) {
        setData({ ...crearCuentaCobroVacia(), ...JSON.parse(guardado) });
      }
    } catch {
      // localStorage no disponible o dato corrupto: se ignora y arranca vacío
    }
    setCargado(true);
  }, []);

  useEffect(() => {
    if (!cargado) return;
    try {
      localStorage.setItem(CLAVE_LOCALSTORAGE, JSON.stringify(data));
    } catch {
      // cuota de almacenamiento excedida u otro error: no es crítico
    }
  }, [data, cargado]);

  function actualizar(patch: Partial<CuentaCobroData>) {
    setData((prev) => ({ ...prev, ...patch }));
  }

  function validar(): boolean {
    const nuevosErrores = validarCuentaCobro(data);
    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) {
      setPestanaMovil("formulario");
      return false;
    }
    return true;
  }

  function limpiar() {
    setData(crearCuentaCobroVacia());
    setErrores({});
    try {
      localStorage.removeItem(CLAVE_LOCALSTORAGE);
    } catch {
      // no-op
    }
  }

  return (
    <main className="min-h-screen pb-10">
      <Header />

      {/* Selector de pestañas en móvil */}
      <div className="lg:hidden sticky top-0 z-20 bg-patry-paper/95 backdrop-blur border-b border-patry-violet-soft px-4 py-2.5 flex gap-2">
        <button
          type="button"
          onClick={() => setPestanaMovil("formulario")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            pestanaMovil === "formulario"
              ? "bg-patry-violet text-white"
              : "text-patry-violet/70"
          }`}
        >
          Formulario
        </button>
        <button
          type="button"
          onClick={() => setPestanaMovil("vista")}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
            pestanaMovil === "vista"
              ? "bg-patry-violet text-white"
              : "text-patry-violet/70"
          }`}
        >
          Vista previa
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[1fr_440px] gap-6 lg:gap-8 mt-4 lg:mt-2">
        <div
          className={`${
            pestanaMovil === "formulario" ? "block" : "hidden"
          } lg:block bg-white rounded-2xl shadow-soft px-5 sm:px-7`}
        >
          <CuentaCobroForm data={data} onChange={actualizar} errores={errores} />
        </div>

        <div className={`${pestanaMovil === "vista" ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-6">
            <div className="rounded-2xl shadow-card overflow-hidden bg-white ring-1 ring-patry-violet-soft">
              <CuentaCobroPreview ref={previewRef} data={data} />
            </div>
            <ActionBar
              data={data}
              previewRef={previewRef}
              onValidar={validar}
              onLimpiar={limpiar}
            />
          </div>
        </div>
      </div>

      <p className="text-center text-[0.7rem] text-patry-ink/35 mt-10 px-4">
        Tus datos se guardan solo en este navegador hasta que envíes o
        limpies el formulario. Patryally no almacena copias adicionales de
        las cuentas de cobro recibidas.
      </p>
    </main>
  );
}
