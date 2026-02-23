"use client";

import React, { useRef } from 'react';
import PlayerCard from '@/components/PlayerCard';
import { Download } from 'lucide-react';
import { toPng } from 'html-to-image';

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null);

  const downloadCard = async () => {
    if (cardRef.current === null) return;
    
    try {
      // Convertimos el div de la carta en una imagen PNG
      const dataUrl = await toPng(cardRef.current, { 
        cacheBust: true,
        style: {
          transform: 'scale(1)',
        }
      });
      
      const link = document.createElement('a');
      link.download = `mi-carta-fifa.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error al generar la imagen:', err);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-8">
      
      {/* Título */}
      <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 mb-12 tracking-tight drop-shadow-lg text-center uppercase">
        FIFA Squad Manager
      </h1>

      <div className="flex flex-col items-center gap-12">
        
        {/* Envolvemos la carta en el ref para poder descargarla */}
        <div ref={cardRef}>
          <PlayerCard 
            name="Sergio"
            position="MC"
            overall={88}
            pac={85}
            sho={82}
            pas={90}
            dri={86}
            def={70}
            phy={78}
          />
        </div>

        {/* Botón de descarga con el evento onClick */}
        <button 
          onClick={downloadCard}
          className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold py-4 px-10 rounded-full flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] active:scale-95 uppercase tracking-wider"
        >
          <Download size={24} strokeWidth={3} />
          Guardar Imagen
        </button>
      </div>
    </main>
  );
}