"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PlayerCard from '@/components/PlayerCard';
import { Loader2 } from 'lucide-react';
// IMPORTANTE: Falta esta línea para que funcione la navegación
import Link from 'next/link'; 

export default function Home() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlayers() {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('overall', { ascending: false });

      if (data) setPlayers(data);
      setLoading(false);
    }
    fetchPlayers();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
      <Loader2 className="animate-spin text-yellow-500" size={48} />
    </div>
  );

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-6">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-black italic tracking-tighter text-yellow-500 uppercase">
          Squad Gallery
        </h1>
        <p className="text-zinc-400 mt-2">Consulta tu progreso y descarga tu carta oficial</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        {players.map((p) => (
          <div key={p.id} className="flex flex-col items-center gap-4">
            <PlayerCard {...p} />
            {/* Ahora el link apunta a la ruta dinámica del jugador */}
            <Link
              href={`/player/${p.id}`}
              className="text-xs font-bold bg-yellow-500 text-black px-6 py-2 rounded-full hover:bg-yellow-400 transition-colors uppercase tracking-widest shadow-lg shadow-yellow-500/20"
            >
              Ver y Descargar
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}