"use client";

import type { CuentaCobroData, TipoDocumento } from "@/lib/types";
import { formatearMiles, soloDigitos } from "@/lib/numeroALetras";
import FirmaCampo from "./FirmaCampo";

interface Props {
  data: CuentaCobroData;
  onChange: (patch: Partial<CuentaCobroData>) => void;
  errores: Record<string, string>;
}

const TIPOS_DOCUMENTO: { value: TipoDocumento; label: string }[] = [
  { value: "CC", label: "Cédula de ciudadanía" },
  { value: "CE", label: "Cédula de extranjería" },
  { value: "PPT", label: "Permiso de protección temporal" },
  { value: "Pasaporte", label: "Pasaporte" },
  { value: "NIT", label: "NIT" },
];

function Seccion({
  numero,
  titulo,
  descripcion,
  children,
}: {
  numero: number;
  titulo: string;
  descripcion?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-patry-violet-soft last:border-0 py-6 first:pt-0">
      <div className="flex items-baseline gap-2.5 mb-4">
        <span className="font-display text-patry-gold text-sm">
          {String(numero).padStart(2, "0")}
        </span>
        <div>
          <h2 className="f-section-title">{titulo}</h2>
          {descripcion && (
            <p className="text-xs text-patry-ink/50 mt-0.5">{descripcion}</p>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function Campo({
  label,
  error,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="f-label">{label}</label>
      {children}
      {error && <p className="f-hint">{error}</p>}
    </div>
  );
}

export default function CuentaCobroForm({ data, onChange, errores }: Props) {
  return (
    <div>
      <Seccion
        numero={1}
        titulo="Tus datos"
        descripcion="Quien presta el servicio y cobra a Patryally"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo label="Nombre completo" error={errores.nombreCompleto} className="sm:col-span-2">
            <input
              type="text"
              className="f-input"
              placeholder="Ej: Laura Gómez Restrepo"
              value={data.nombreCompleto}
              aria-invalid={!!errores.nombreCompleto}
              onChange={(e) => onChange({ nombreCompleto: e.target.value })}
            />
          </Campo>

          <Campo label="Tipo de documento">
            <select
              className="f-input"
              value={data.tipoDocumento}
              onChange={(e) =>
                onChange({ tipoDocumento: e.target.value as TipoDocumento })
              }
            >
              {TIPOS_DOCUMENTO.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.value} · {t.label}
                </option>
              ))}
            </select>
          </Campo>

          <Campo label="Número de documento" error={errores.numeroDocumento}>
            <input
              type="text"
              inputMode="numeric"
              className="f-input"
              placeholder="Ej: 1017123456"
              value={data.numeroDocumento}
              aria-invalid={!!errores.numeroDocumento}
              onChange={(e) =>
                onChange({ numeroDocumento: soloDigitos(e.target.value) })
              }
            />
          </Campo>

          <Campo label="Celular" error={errores.celular}>
            <input
              type="tel"
              inputMode="numeric"
              className="f-input"
              placeholder="Ej: 3001234567"
              value={data.celular}
              aria-invalid={!!errores.celular}
              onChange={(e) => onChange({ celular: soloDigitos(e.target.value) })}
            />
          </Campo>

          <Campo label="Correo para respuesta (opcional)">
            <input
              type="email"
              className="f-input"
              placeholder="tucorreo@ejemplo.com"
              value={data.correoContacto}
              onChange={(e) => onChange({ correoContacto: e.target.value })}
            />
          </Campo>
        </div>
      </Seccion>

      <Seccion
        numero={2}
        titulo="Empresa que paga"
        descripcion="Va prellenado con Patryally; ajústalo solo si es necesario"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo label="Nombre de la empresa">
            <input
              type="text"
              className="f-input"
              value={data.empresaNombre}
              onChange={(e) => onChange({ empresaNombre: e.target.value })}
            />
          </Campo>
          <Campo label="NIT">
            <input
              type="text"
              className="f-input"
              value={data.empresaNit}
              onChange={(e) => onChange({ empresaNit: e.target.value })}
            />
          </Campo>
          <Campo label="Ciudad">
            <input
              type="text"
              className="f-input"
              value={data.ciudad}
              onChange={(e) => onChange({ ciudad: e.target.value })}
            />
          </Campo>
          <Campo label="Fecha">
            <input
              type="date"
              className="f-input"
              value={data.fecha}
              onChange={(e) => onChange({ fecha: e.target.value })}
            />
          </Campo>
          <Campo label="N.° de cuenta de cobro">
            <input
              type="text"
              className="f-input"
              value={data.consecutivo}
              onChange={(e) => onChange({ consecutivo: e.target.value })}
            />
          </Campo>
        </div>
      </Seccion>

      <Seccion numero={3} titulo="Detalle del cobro">
        <div className="grid grid-cols-1 gap-4">
          <Campo label="Concepto de pago" error={errores.concepto}>
            <textarea
              className="f-input min-h-[84px] resize-y"
              placeholder="Ej: Servicio de guianza turística bilingüe, tour Comuna 13, del 1 al 5 de julio de 2026"
              value={data.concepto}
              aria-invalid={!!errores.concepto}
              onChange={(e) => onChange({ concepto: e.target.value })}
            />
          </Campo>

          <Campo label="Valor a cobrar (COP)" error={errores.valor} className="sm:max-w-xs">
            <div className="relative">
              <span className="absolute left-1 top-1/2 -translate-y-1/2 text-patry-ink/40 text-sm">
                $
              </span>
              <input
                type="text"
                inputMode="numeric"
                className="f-input pl-9"
                placeholder="0"
                value={formatearMiles(data.valor)}
                aria-invalid={!!errores.valor}
                onChange={(e) => onChange({ valor: soloDigitos(e.target.value) })}
              />
            </div>
          </Campo>
        </div>
      </Seccion>

      <Seccion
        numero={4}
        titulo="Declaración tributaria"
        descripcion="Art. 383 E.T. y Decreto 1273 de 2014, para efectos de retención en la fuente"
      >
        <div className="space-y-3">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-patry-violet-soft accent-patry-violet"
              checked={data.declaranteRenta}
              onChange={(e) => onChange({ declaranteRenta: e.target.checked })}
            />
            <span className="text-sm text-patry-ink/75">
              Soy persona declarante de renta
            </span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-patry-violet-soft accent-patry-violet"
              checked={data.contratoOtrosTrabajadores}
              onChange={(e) =>
                onChange({ contratoOtrosTrabajadores: e.target.checked })
              }
            />
            <span className="text-sm text-patry-ink/75">
              Para este servicio contraté a dos o más trabajadores o
              contratistas
            </span>
          </label>
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 rounded border-patry-violet-soft accent-patry-violet"
              checked={data.obligadoFacturar}
              onChange={(e) => onChange({ obligadoFacturar: e.target.checked })}
            />
            <span className="text-sm text-patry-ink/75">
              Estoy obligado(a) a facturar electrónicamente
            </span>
          </label>
        </div>
      </Seccion>

      <Seccion
        numero={5}
        titulo="Datos de pago"
        descripcion="A esta cuenta te consignará Patryally"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Campo label="Banco / billetera" error={errores.banco}>
            <select
              className="f-input"
              value={data.banco}
              onChange={(e) => onChange({ banco: e.target.value })}
            >
              <option value="">Selecciona...</option>
              <option value="Bancolombia">Bancolombia</option>
              <option value="Nequi">Nequi</option>
              <option value="Daviplata">Daviplata</option>
              <option value="Davivienda">Davivienda</option>
              <option value="BBVA">BBVA</option>
              <option value="Banco de Bogotá">Banco de Bogotá</option>
              <option value="Banco de Occidente">Banco de Occidente</option>
              <option value="Banco Agrario">Banco Agrario</option>
              <option value="Banco Caja Social">Banco Caja Social</option>
              <option value="Scotiabank Colpatria">Scotiabank Colpatria</option>
            </select>
          </Campo>
          <Campo label="Tipo de cuenta">
            <select
              className="f-input"
              value={data.tipoCuentaBancaria}
              onChange={(e) =>
                onChange({
                  tipoCuentaBancaria: e.target.value as "Ahorros" | "Corriente",
                })
              }
            >
              <option value="Ahorros">Ahorros</option>
              <option value="Corriente">Corriente</option>
            </select>
          </Campo>
          <Campo
            label="Número de cuenta"
            error={errores.numeroCuentaBancaria}
            className="sm:col-span-2"
          >
            <input
              type="text"
              inputMode="numeric"
              className="f-input"
              value={data.numeroCuentaBancaria}
              aria-invalid={!!errores.numeroCuentaBancaria}
              onChange={(e) =>
                onChange({ numeroCuentaBancaria: soloDigitos(e.target.value) })
              }
            />
          </Campo>
        </div>
      </Seccion>

      <Seccion numero={6} titulo="Firma">
        <FirmaCampo data={data} onChange={onChange} />
      </Seccion>
    </div>
  );
}
