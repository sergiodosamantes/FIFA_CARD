import React from 'react';

interface PlayerProps {
  name: string;
  position: string;
  overall: number;
  pac: number;
  sho: number;
  pas: number;
  dri: number;
  def: number;
  phy: number;
  imageUrl?: string;
}

export default function PlayerCard({
  name, position, overall, pac, sho, pas, dri, def, phy, imageUrl
}: PlayerProps) {
  return (
    <div className="relative group hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_25px_rgba(250,204,21,0.6)] select-none">
      
      <div className="w-72 h-[30rem] bg-gradient-to-br from-[#fef08a] via-[#eab308] to-[#a16207] p-1 
                      [clip-path:polygon(0_0,100%_0,100%_80%,50%_100%,0_80%)] 
                      flex flex-col items-center">
        
        <div className="w-full h-full bg-gradient-to-br from-[#facc15] via-[#ca8a04] to-[#854d0e] 
                        [clip-path:polygon(0_0,100%_0,100%_82%,50%_100%,0_82%)] 
                        flex flex-col items-center p-4 relative text-[#2a1a00]">
          
          <div className="absolute top-10 w-full h-1/2 bg-gradient-to-t from-yellow-200/40 to-transparent rounded-full blur-2xl z-0"></div>

          <div className="absolute top-6 left-6 flex flex-col items-center z-10">
            <span className="text-5xl font-black tracking-tighter leading-none text-[#1a1000] drop-shadow-md">
              {overall}
            </span>
            <span className="text-xl font-bold uppercase mt-1 text-[#2a1a00]">{position}</span>
          </div>
          
          <div className="w-40 h-40 mt-10 mb-2 flex items-center justify-center relative z-10">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full object-contain drop-shadow-xl" />
            ) : (
              <div className="w-32 h-32 bg-yellow-950/10 rounded-full border-2 border-yellow-200/30 flex items-center justify-center backdrop-blur-sm">
                <span className="text-yellow-950/60 text-sm font-bold uppercase tracking-widest">Sin Foto</span>
              </div>
            )}
          </div>

          <h2 className="text-2xl font-black uppercase tracking-widest text-center border-b-2 border-[#522e04]/20 w-10/12 pb-2 mb-4 z-10 drop-shadow-sm">
            {name}
          </h2>

          <div className="w-10/12 grid grid-cols-2 gap-x-8 gap-y-2 text-base z-10">
            <div className="flex justify-between items-center"><span className="text-lg font-black">{pac}</span> <span className="font-semibold text-[#522e04]">PAC</span></div>
            <div className="flex justify-between items-center"><span className="text-lg font-black">{dri}</span> <span className="font-semibold text-[#522e04]">DRI</span></div>
            <div className="flex justify-between items-center"><span className="text-lg font-black">{sho}</span> <span className="font-semibold text-[#522e04]">SHO</span></div>
            <div className="flex justify-between items-center"><span className="text-lg font-black">{def}</span> <span className="font-semibold text-[#522e04]">DEF</span></div>
            <div className="flex justify-between items-center"><span className="text-lg font-black">{pas}</span> <span className="font-semibold text-[#522e04]">PAS</span></div>
            <div className="flex justify-between items-center"><span className="text-lg font-black">{phy}</span> <span className="font-semibold text-[#522e04]">PHY</span></div>
          </div>

          <div className="mt-auto mb-2 w-16 h-1 bg-[#522e04]/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}