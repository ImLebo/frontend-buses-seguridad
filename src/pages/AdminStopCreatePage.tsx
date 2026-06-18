import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { paraderoService } from '../services/business/paraderoService';

// Selected node icon (red) to indicate new stop placement
const newStopIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

export const AdminStopCreatePage = () => {
  const navigate = useNavigate();
  
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [clasificacion, setClasificacion] = useState('Principal');
  const [position, setPosition] = useState<[number, number] | null>(null);
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('admin-stop-map', {
        zoomControl: true,
        fadeAnimation: true,
      }).setView([4.6097, -74.0817], 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      }).addTo(map);

      map.on('click', (e: L.LeafletMouseEvent) => {
        setPosition([e.latlng.lat, e.latlng.lng]);
      });

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (mapRef.current && position) {
      if (!markerRef.current) {
        markerRef.current = L.marker(position, { icon: newStopIcon }).addTo(mapRef.current);
        markerRef.current.bindPopup('Ubicación del nuevo paradero').openPopup();
      } else {
        markerRef.current.setLatLng(position);
      }
    }
  }, [position]);



  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!position) {
      setError('Debes marcar la ubicación del paradero en el mapa.');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      await paraderoService.create({
        nombre,
        descripcion,
        clasificacion,
        latitud: position[0].toString(),
        longitud: position[1].toString()
      } as any); // cast needed due to TS type mismatch vs CreateParaderoDto where sometimes number is expected but backend accepts string for decimals
      
      alert('¡Paradero creado exitosamente!');
      navigate('/app/citizen-stops'); // Could go to an Admin Stops List if it existed, for now citizen-stops is a good preview.
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al guardar el paradero';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Crear Nuevo Paradero</h1>
            <p className="text-slate-500 text-sm mt-1">Registra un nuevo punto de abordaje/descenso en el mapa</p>
         </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center justify-between">
           <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
           </div>
           <button onClick={() => setError(null)} className="p-1 hover:bg-rose-100 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Panel: Form */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
           <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
             <form id="stop-form" onSubmit={handleSave} className="space-y-5">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nombre del Paradero</label>
                  <input 
                    required
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Ej. Estación Central Norte"
                    className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                  />
               </div>
               
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Paradero</label>
                  <select 
                     value={clasificacion}
                     onChange={e => setClasificacion(e.target.value)}
                     className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-0 transition-colors bg-white font-medium"
                  >
                     <option value="Principal">Principal (Transbordo masivo)</option>
                     <option value="Secundario">Secundario (Rutas locales)</option>
                     <option value="Terminal">Terminal (Inicio/Fin de ruta)</option>
                  </select>
               </div>

               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
                  <textarea 
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    rows={2}
                    placeholder="Detalles sobre el paradero..."
                    className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                  />
               </div>

               <hr className="border-slate-100" />
               
               <div>
                  <div className="flex items-center justify-between mb-2">
                     <label className="block text-sm font-bold text-slate-700">Coordenadas GPS</label>
                     {position && <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Capturadas</span>}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                     <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">Latitud</span>
                        <input 
                           readOnly
                           type="text"
                           value={position ? position[0].toFixed(6) : ''}
                           placeholder="Clic en el mapa"
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-600 font-mono outline-none"
                        />
                     </div>
                     <div>
                        <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1 block">Longitud</span>
                        <input 
                           readOnly
                           type="text"
                           value={position ? position[1].toFixed(6) : ''}
                           placeholder="Clic en el mapa"
                           className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-sm text-slate-600 font-mono outline-none"
                        />
                     </div>
                  </div>
                  {!position && (
                     <p className="text-xs text-amber-600 mt-2 font-medium flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                        Obligatorio. Por favor ubica el punto en el mapa interactivo.
                     </p>
                  )}
               </div>

             </form>
           </div>

           <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button 
                type="submit" 
                form="stop-form"
                disabled={isSaving || !position}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    Guardar Paradero
                  </>
                )}
              </button>
           </div>
        </div>

        {/* Right Panel: Interactive Map */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
           <div 
             id="admin-stop-map"
             style={{ height: '100%', width: '100%', zIndex: 0 }}
           ></div>

           {/* Floating Map Hint */}
           {!position && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-slate-900/80 text-white backdrop-blur px-4 py-2 rounded-full shadow-lg z-[1000] text-sm font-medium animate-bounce pointer-events-none">
                 Haz clic en cualquier punto del mapa para ubicar el paradero
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default AdminStopCreatePage;
