'use client';

import { useEffect, useState } from 'react';

interface MacroItem {
  label: string;
  value: string;
  detail: string;
  badge?: string;
}

export default function MacroData() {
  const [items, setItems] = useState<MacroItem[]>([
    { label: 'Riesgo País', value: '1.090 pts', detail: 'JP Morgan', badge: 'JP Morgan' },
    { label: 'Tasa Plazo Fijo', value: '38.0%', detail: 'TNA Promedio', badge: 'BCRA' },
    { label: 'Inflación Mensual', value: '3.7%', detail: 'Último IPC', badge: 'INDEC' },
    { label: 'Reservas BCRA', value: 'USD 28.200 M', detail: 'Reservas Brutas', badge: 'Brutas' },
  ]);

  useEffect(() => {
    async function cargarMacro() {
      try {
        const res = await fetch('/api/macro');
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            setItems(json.data);
          }
        }
      } catch (err) {
        console.error('Error cargando datos macro:', err);
      }
    }

    cargarMacro();
  }, []);

  return (
    <section className="w-full">
      <h2 className="section-title mb-4">Indicadores Macro</h2>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {items.map((item, idx) => (
          <div
            key={idx}
            className="card card-hover flex flex-col justify-between p-4"
          >
            <div className="flex items-center justify-between text-xs text-violet-300">
              <span>{item.label}</span>
              {item.badge && (
                <span className="rounded bg-gold/10 px-1.5 py-0.5 text-[10px] font-medium text-gold">
                  {item.badge}
                </span>
              )}
            </div>

            <div className="my-2 text-xl font-extrabold text-white">
              {item.value}
            </div>

            <div className="text-[11px] text-violet-300/70">
              {item.detail}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}