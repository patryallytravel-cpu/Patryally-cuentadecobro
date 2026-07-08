import Image from "next/image";

export default function Header() {
  return (
    <header className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-6">
        <div className="flex items-center justify-between gap-4">
          <Image
            src="/logo.png"
            alt="Patryally"
            width={168}
            height={168}
            priority
            className="h-11 w-auto sm:h-14"
          />
          <a
            href="https://patryally.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-patry-violet hover:text-patry-violet-deep transition-colors"
          >
            patryally.com
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M7 17L17 7M17 7H9M17 7V15"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className="mt-8 sm:mt-10 max-w-2xl">
          <p className="f-eyebrow text-[0.75rem] font-semibold tracking-[0.14em] text-patry-gold uppercase mb-3">
            Proveedores &amp; contratistas
          </p>
          <h1 className="font-display text-[2.1rem] sm:text-[2.75rem] leading-[1.08] text-patry-violet-deep">
            Genera tu cuenta de cobro
            <br className="hidden sm:block" /> y envíala a Patryally
          </h1>
          <p className="mt-4 text-[0.98rem] sm:text-base text-patry-ink/70 leading-relaxed">
            Completa tus datos, revisa la vista previa y elige si la
            descargas en PDF o la envías directamente a nuestro equipo de
            contabilidad. Todo se genera en tu navegador.
          </p>
        </div>
      </div>

      {/* Acento decorativo: curva de sonrisa + trayectoria de vuelo, eco del logo */}
      <svg
        className="absolute right-[-40px] top-2 w-[220px] sm:w-[300px] opacity-[0.14] pointer-events-none"
        viewBox="0 0 300 200"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M20 60 C 90 150, 210 150, 280 40"
          stroke="#4913C2"
          strokeWidth="7"
          strokeLinecap="round"
        />
      </svg>
    </header>
  );
}
