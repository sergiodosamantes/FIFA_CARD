"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import PlayerCard from '@/components/PlayerCard';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Traer todos los jugadores de la base de datos
  useEffect(() => {
    async function fetchPlayers() {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('overall', { ascending: false }); // Los mejores primero

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

      {/* Grid de Cartas para que "Juan" las vea todas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        {players.map((p) => (
          <div key={p.id} className="flex flex-col items-center gap-4">
            <PlayerCard {...p} />
            {/* Botón de descarga individual para cada carta */}
            <button className="text-xs font-bold bg-zinc-800 hover:bg-zinc-700 px-4 py-2 rounded-full transition-colors">
              DESCARGAR CARTA
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}