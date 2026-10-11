'use client';

import React, { useState } from 'react';

export default function ShareBar() {
  const [copiado, setCopiado] = useState(false);

  const url = 'https://checkdolar.com.ar';
  const emailContacto = 'checkdolar.ar@gmail.com';
  const textoCompartir = encodeURIComponent(`Mirá las cotizaciones del dólar en tiempo real y herramientas financieras en ${url}`);

  const copiarEnlace = () => {
    navigator.clipboard.writeText(url);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  return (
    <div className="w-full space-y-4 my-8">
      {/* Banner de Apoyo / Cafecito (Estilo Dolarito) */}
      <div className="w-full bg-gradient-to-r from-violet-900/40 via-[#130f25] to-cyan-900/40 border border-cyan-500/30 rounded-2xl p-6 shadow-xl text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="p-3 bg-cyan-600/20 rounded-2xl border border-cyan-500/30 text-cyan-400 text-2xl flex-shrink-0">
            ☕
          </div>
          <div>
            <h3 className="text-lg font-bold text-cyan-300">¿Te resulta útil CheckDolar?</h3>
            <p className="text-sm text-gray-300 mt-0.5">Apoyá el desarrollo del sitio para mantenerlo libre y actualizado al instante.</p>
          </div>
        </div>
        <a
          href="https://cafecito.app/checkdolar"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-6 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20 flex-shrink-0"
        >
          ☕ Invítanos un cafecito
        </a>
      </div>

      {/* Barra de Redes, Email y Compartir Completa */}
      <div className="w-full bg-[#130f25] border border-violet-500/20 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-2">
          <span className="text-violet-400">🌐</span>
          <span className="text-sm font-semibold text-gray-300">Contacto y Redes:</span>
        </div>

        <div className="flex items-center flex-wrap gap-2.5">
          {/* Email de contacto */}
          <a
            href={`mailto:${emailContacto}?subject=Contacto%20desde%20CheckDolar`}
            className="bg-amber-600/20 border border-amber-500/30 hover:bg-amber-600/30 text-amber-300 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            ✉️ {emailContacto}
          </a>

          {/* WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${textoCompartir}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600/20 border border-emerald-500/30 hover:bg-emerald-600/30 text-emerald-400 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            📱 WhatsApp
          </a>

          {/* X (Twitter) */}
          <a
            href={`https://twitter.com/intent/tweet?text=${textoCompartir}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700/30 border border-gray-600/40 hover:bg-gray-700/50 text-gray-200 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            𝕏 X (Twitter)
          </a>

          {/* Facebook */}
          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-blue-600/20 border border-blue-500/30 hover:bg-blue-600/30 text-blue-400 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            📘 Facebook
          </a>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/checkdolar.ar"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-pink-600/20 border border-pink-500/30 hover:bg-pink-600/30 text-pink-400 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            📸 Instagram
          </a>

          {/* Copiar Link */}
          <button
            onClick={copiarEnlace}
            className="bg-violet-600/20 border border-violet-500/30 hover:bg-violet-600/30 text-violet-300 text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            {copiado ? '✅ ¡Copiado!' : '🔗 Copiar Link'}
          </button>
        </div>
      </div>
    </div>
  );
}