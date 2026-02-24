"use client";

import { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PlayerCard from '@/components/PlayerCard';
import { toPng } from 'html-to-image';
import { Download, Home } from 'lucide-react';
import Link from 'next/link';

export default function PlayerView() {
  const { id } = useParams();
  const [player, setPlayer] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getPlayer() {
      const { data } = await supabase.from('players').select('*').eq('id', id).single();
      if (data) setPlayer(data);
    }
    getPlayer();
  }, [id]);

  const download = async () => {
    if (cardRef.current) {
      const dataUrl = await toPng(cardRef.current);
      const link = document.createElement('a');
      link.download = `${player.name}-card.png`;
      link.href = dataUrl;
      link.click();
    }
  };

  if (!player) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">Cargando carta...</div>;

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-white">
      <div ref={cardRef} className="mb-10">
        <PlayerCard {...player} />
      </div>
      
      <div className="flex gap-4">
        <Link href="/" className="bg-zinc-800 p-4 rounded-full hover:bg-zinc-700 transition-colors">
          <Home size={24} />
        </Link>
        <button 
          onClick={download}
          className="bg-yellow-500 text-black font-black py-4 px-10 rounded-full flex items-center gap-2 hover:bg-yellow-400 transition-transform active:scale-95 shadow-lg shadow-yellow-500/20"
        >
          <Download size={24} strokeWidth={3} />
          DESCARGAR MI CARTA
        </button>
      </div>
    </main>
  );
}