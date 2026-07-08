# Cuenta de Cobro · Patryally

Formulario web para que contratistas y proveedores independientes generen su
cuenta de cobro, la vean en una vista previa fiel al PDF final, la descarguen
y/o la envíen directamente por correo al equipo de Patryally.

Construido con Next.js 16 (App Router) + TypeScript + Tailwind CSS.

## ¿Qué incluye?

- Formulario completo por secciones (datos del contratista, empresa que
  paga, detalle del cobro, declaración tributaria, datos bancarios, firma).
- Cálculo automático del valor "en letras" (ej: `$1.500.000` →
  "UN MILLÓN QUINIENTOS MIL PESOS M/CTE").
- Firma digital en 3 modos: escribir (con 3 estilos manuscritos), dibujar a
  mano y subir una imagen.
- Vista previa en vivo, 100% fiel al PDF (se genera con `html2canvas` +
  `jsPDF` a partir del mismo HTML que ves en pantalla).
- Autoguardado en el navegador (`localStorage`) mientras se llena el
  formulario.
- Botón **Descargar PDF**.
- Botón **Enviar a Patryally**: envía automáticamente el PDF por correo a
  `Contabilidad.patryally@outlook.com` y `Patryallytravel@gmail.com` usando
  [Resend](https://resend.com).
- Marca de Patryally aplicada en toda la interfaz (logo, color violeta de
  marca `#4913C2`, tipografías Fraunces + Plus Jakarta Sans).

## 1. Requisitos

- Node.js 18.18 o superior
- Una cuenta gratuita en [resend.com](https://resend.com) (para el botón de
  enviar por correo)

## 2. Instalación local

```bash
npm install
cp .env.example .env.local
```

Edita `.env.local` con tus valores (ver sección 3) y luego:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## 3. Configurar el envío de correo (Resend)

El botón "Enviar a Patryally" necesita una API key de Resend para funcionar.
Sin ella, la app funciona igual para llenar el formulario y descargar el PDF,
pero mostrará un aviso si se intenta enviar por correo.

1. Crea una cuenta gratuita en <https://resend.com> (incluye 3.000 correos al
   mes gratis, 100 al día).
2. Ve a **API Keys** → **Create API Key** y copia el valor (empieza con
   `re_`).
3. Pégalo como `RESEND_API_KEY` en `.env.local` (local) y más adelante en
   Vercel (paso 5).
4. **Remitente ("From"):** mientras no verifiques el dominio `patryally.com`
   en Resend, deja `EMAIL_FROM="Patryally <onboarding@resend.dev>"` — Resend
   permite enviar de inmediato desde ese dominio de pruebas a cualquier
   destinatario. Cuando quieras que los correos salgan desde
   `@patryally.com`:
   - En Resend, ve a **Domains** → **Add Domain** → `patryally.com`.
   - Agrega los registros DNS (TXT/DKIM/MX) que te indique Resend en tu
     proveedor de dominio.
   - Una vez verificado, cambia `EMAIL_FROM` a algo como
     `Cuentas de Cobro Patryally <cuentas@patryally.com>`.
5. `EMAIL_TO` ya viene con los dos correos solicitados separados por coma;
   solo cámbialo si necesitas agregar o quitar destinatarios.

## 4. Personalizar datos

- **Logo:** `public/logo.png` (el que compartiste) y `app/icon.png`
  (favicon recortado del mismo logo).
- **Color/tipografías de marca:** `tailwind.config.ts` (paleta `patry.*`) y
  `app/layout.tsx` (fuentes de Google Fonts).
- **NIT de Patryally:** el campo "NIT" en el formulario queda vacío por
  defecto (no lo tenía para prellenarlo) — puedes ponerlo fijo editando
  `EMPRESA_POR_DEFECTO` en `lib/types.ts` si quieres que siempre aparezca.
- **Ciudad por defecto:** también en `crearCuentaCobroVacia()` dentro de
  `lib/types.ts` (actualmente "Medellín").

## 5. Desplegar en Vercel

1. Sube este proyecto a un repositorio de GitHub (puedes usar
   `git init && git add . && git commit -m "Patryally cuenta de cobro"` y
   luego crear el repo en GitHub y hacer push).
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el
   repositorio.
3. Vercel detecta Next.js automáticamente, no necesitas cambiar nada del
   build.
4. Antes de darle **Deploy**, abre **Environment Variables** y agrega:
   - `RESEND_API_KEY` → tu API key de Resend
   - `EMAIL_FROM` → `Patryally <onboarding@resend.dev>` (o tu remitente
     verificado)
   - `EMAIL_TO` → `Contabilidad.patryally@outlook.com,Patryallytravel@gmail.com`
5. Deploy. Cuando termine, tendrás una URL tipo
   `https://tu-proyecto.vercel.app` — puedes conectarle después un dominio
   propio (ej. `cuentadecobro.patryally.com`) desde **Settings → Domains**.

## Estructura del proyecto

```
app/
  page.tsx                 → orquesta formulario + vista previa + acciones
  layout.tsx                → fuentes de marca y metadata
  globals.css                → tokens visuales (colores, inputs, etc.)
  api/enviar-correo/route.ts → endpoint serverless que envía el correo (Resend)
components/
  Header.tsx                 → encabezado con logo y acento de marca
  CuentaCobroForm.tsx         → formulario completo por secciones
  CuentaCobroPreview.tsx      → documento (fuente de verdad visual del PDF)
  FirmaCampo.tsx              → firma: escribir / dibujar / subir
  ActionBar.tsx                → botones Descargar PDF / Enviar a Patryally
lib/
  types.ts                     → tipos + valores por defecto
  numeroALetras.ts              → conversor de número a letras (pesos COP)
  formato.ts                    → formateo de fecha en español
  generarPdf.ts                 → captura la vista previa como PDF
  validacion.ts                 → reglas de campos obligatorios
```

## Notas de privacidad

Los datos del formulario solo se guardan en el navegador de quien lo llena
(`localStorage`), hasta que la persona envíe o limpie el formulario. Al usar
"Enviar a Patryally", los datos viajan una sola vez a través del endpoint
`/api/enviar-correo` hacia Resend para entregarse por correo; el servidor no
los guarda en ninguna base de datos.
