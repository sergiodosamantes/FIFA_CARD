"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import PlayerCard from '@/components/PlayerCard';
import { Save, Upload, Loader2, Edit2, Trash2, Plus, CheckCircle2 } from 'lucide-react';

export default function AdminPanel() {
  const [players, setPlayers] = useState<any[]>([]);
  const [player, setPlayer] = useState({
    id: null,
    name: "",
    position: "MC",
    pac: 80, sho: 80, pas: 80, dri: 80, def: 80, phy: 80,
    imageUrl: ""
  });
  
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchPlayers();
  }, []);

  async function fetchPlayers() {
    const { data } = await supabase.from('players').select('*').order('created_at', { ascending: false });
    if (data) setPlayers(data);
  }

  // LÓGICA DE CARGA DE ARCHIVOS (Alta Calidad)
  const handleFileUpload = async (event: any) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Subida al Bucket 'player_avatars'
      const { error: uploadError } = await supabase.storage
        .from('player_avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obtener URL Pública
      const { data } = supabase.storage
        .from('player_avatars')
        .getPublicUrl(filePath);

      setPlayer(prev => ({ ...prev, imageUrl: data.publicUrl }));
      alert("¡Imagen lista y procesada!");
    } catch (error: any) {
      alert("Error en la subida: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const calculateOverall = () => {
    const { pac, sho, pas, dri, def, phy } = player;
    return Math.round((pac * 0.1) + (sho * 0.25) + (pas * 0.15) + (dri * 0.2) + (def * 0.05) + (phy * 0.25));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlayer(prev => ({
      ...prev,
      [name]: ["name", "position"].includes(name) ? value : parseInt(value) || 0
    }));
  };

  const savePlayer = async () => {
    setIsSaving(true);
    const overall = calculateOverall();
    
    // Mapeo correcto para la DB (image_url)
    const playerData = {
      name: player.name,
      position: player.position,
      pac: player.pac,
      sho: player.sho,
      pas: player.pas,
      dri: player.dri,
      def: player.def,
      phy: player.phy,
      image_url: player.imageUrl, 
      overall: overall
    };

    let error;
    if (player.id) {
      const { error: updateError } = await supabase.from('players').update(playerData).eq('id', player.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase.from('players').insert([playerData]);
      error = insertError;
    }

    if (error) alert("Error: " + error.message);
    else {
      alert(player.id ? "Estadísticas actualizadas con éxito" : "Jugador creado con éxito");
      resetForm();
      fetchPlayers();
    }
    setIsSaving(false);
  };

  const loadPlayerToEdit = (p: any) => {
    setPlayer({
      id: p.id,
      name: p.name,
      position: p.position,
      pac: p.pac,
      sho: p.sho,
      pas: p.pas,
      dri: p.dri,
      def: p.def,
      phy: p.phy,
      imageUrl: p.image_url // Cargamos la foto actual
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setPlayer({ id: null, name: "", position: "MC", pac: 80, sho: 80, pas: 80, dri: 80, def: 80, phy: 80, imageUrl: "" });
  };

  const deletePlayer = async (id: string) => {
    if (confirm("¿Estás seguro de eliminar esta carta?")) {
      const { error } = await supabase.from('players').delete().eq('id', id);
      if (error) alert(error.message);
      else fetchPlayers();
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-10">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* FORMULARIO DE GESTIÓN */}
          <div className="bg-zinc-900 p-8 rounded-3xl border border-zinc-800 shadow-2xl space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-black text-yellow-500 uppercase italic tracking-tighter">
                {player.id ? 'Modificar Atributos' : 'Crear Nueva Carta'}
              </h1>
              {player.id && (
                <button onClick={resetForm} className="text-xs font-bold bg-yellow-500/10 text-yellow-500 px-4 py-2 rounded-full flex items-center gap-2 hover:bg-yellow-500/20 transition-all">
                  <Plus size={14} /> Crear Nuevo
                </button>
              )}
            </div>
            
            <div className="space-y-4">
              {/* DATOS BÁSICOS */}
              <input type="text" name="name" value={player.name} placeholder="Nombre del Jugador" onChange={handleChange} className="w-full bg-zinc-800 p-4 rounded-xl outline-none border border-transparent focus:border-yellow-500 transition-all font-bold" />
              
              <div className="grid grid-cols-2 gap-4">
                <select name="position" value={player.position} onChange={handleChange} className="bg-zinc-800 p-4 rounded-xl outline-none border border-transparent focus:border-yellow-500 font-bold">
                  <option value="PO">PO</option><option value="DFC">DFC</option><option value="MC">MC</option><option value="DC">DC</option>
                </select>
                
                {/* SUBIR ARCHIVO */}
                <div className="relative">
                  <input type="file" accept="image/*" onChange={handleFileUpload} disabled={uploading} className="hidden" id="player-photo" />
                  <label htmlFor="player-photo" className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 border-dashed border-zinc-700 cursor-pointer hover:border-yellow-500 transition-all ${uploading ? 'opacity-50' : ''}`}>
                    {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                    <span className="text-sm font-bold">{player.imageUrl ? 'Cambiar Foto' : 'Subir JPG/PNG'}</span>
                  </label>
                </div>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-6">
                {['pac', 'sho', 'pas', 'dri', 'def', 'phy'].map(stat => (
                  <div key={stat} className="flex flex-col gap-1">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{stat}</label>
                    <input type="number" name={stat} value={player[stat as keyof typeof player] as number} onChange={handleChange} className="bg-zinc-800 p-3 rounded-xl outline-none border border-transparent focus:border-yellow-500 text-center font-bold" />
                  </div>
                ))}
              </div>

              <button onClick={savePlayer} disabled={isSaving || uploading} className="w-full bg-yellow-500 text-black font-black py-5 rounded-2xl flex items-center justify-center gap-3 mt-4 hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-500/20 uppercase tracking-tighter">
                {isSaving ? <Loader2 className="animate-spin" /> : <Save size={24} />}
                {player.id ? 'Actualizar Carta' : 'Confirmar y Guardar'}
              </button>
            </div>
          </div>

          {/* VISTA PREVIA */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-zinc-600 font-black uppercase text-xs tracking-widest">Vista Previa en Tiempo Real</p>
            <PlayerCard {...player} overall={calculateOverall()} />
          </div>
        </div>

        {/* LISTADO DE GESTIÓN */}
        <div className="bg-zinc-900/30 p-8 rounded-3xl border border-zinc-800">
          <h2 className="text-xl font-black mb-8 text-zinc-500 uppercase italic">Base de Datos de Jugadores</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {players.map(p => (
              <div key={p.id} className="bg-zinc-900 p-5 rounded-2xl flex justify-between items-center border border-zinc-800 hover:border-zinc-700 transition-all group">
                <div className="flex items-center gap-4">
                   <div className="w-10 h-10 rounded-full bg-zinc-800 overflow-hidden">
                      <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                   </div>
                   <div>
                    <p className="font-black text-lg leading-none">{p.name}</p>
                    <p className="text-[10px] text-yellow-500 font-bold mt-1 uppercase tracking-widest">{p.position} • {p.overall} OVR</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => loadPlayerToEdit(p)} className="p-3 bg-zinc-800 hover:bg-yellow-500 hover:text-black rounded-xl transition-all">
                    <Edit2 size={18} />
                  </button>
                  <button onClick={() => deletePlayer(p.id)} className="p-3 bg-zinc-800 hover:bg-red-600 rounded-xl transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}