import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import { useAdminRouteCreate } from '../hooks/business/useAdminRouteCreate';

// Default map icon
const defaultIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Selected node icon (green)
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

export const AdminRouteCreatePage = () => {
  const navigate = useNavigate();
  const {
    allParaderos,
    loadingParaderos,
    nodes,
    addNode,
    removeNode,
    updateNodeTime,
    updateNodeDistance,
    saveRoute,
    isSaving,
    error,
    clearError
  } = useAdminRouteCreate();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tarifa, setTarifa] = useState('2500');

  const mapRef = useRef<L.Map | null>(null);
  const markersGroupRef = useRef<L.LayerGroup | null>(null);
  const polylineRef = useRef<L.Polyline | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current && !loadingParaderos) {
      const map = L.map('admin-route-map', {
        zoomControl: true,
        fadeAnimation: true,
      }).setView([4.6097, -74.0817], 13);

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
      }).addTo(map);

      mapRef.current = map;
      markersGroupRef.current = L.layerGroup().addTo(map);
      polylineRef.current = L.polyline([], {
        color: '#4F46E5',
        weight: 5,
        opacity: 0.7,
        dashArray: '10, 10'
      }).addTo(map);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [loadingParaderos]);

  // Update Map Elements
  useEffect(() => {
    if (!mapRef.current || !markersGroupRef.current || !polylineRef.current) return;
    
    const map = mapRef.current;
    const markersGroup = markersGroupRef.current;
    const polyline = polylineRef.current;

    markersGroup.clearLayers();

    // Draw markers
    allParaderos.forEach(paradero => {
      const isSelected = nodes.some(n => n.paraderoId === paradero.paradero_id);
      const order = isSelected ? nodes.find(n => n.paraderoId === paradero.paradero_id)?.orden : null;

      const marker = L.marker([Number(paradero.latitud), Number(paradero.longitud)], {
        icon: isSelected ? selectedIcon : defaultIcon
      });

      const popupContent = document.createElement('div');
      popupContent.className = 'text-center min-w-[120px]';
      popupContent.innerHTML = `
        <h4 class="font-bold text-slate-800 mb-1">${paradero.nombre}</h4>
        ${isSelected 
          ? `<div class="bg-emerald-100 text-emerald-700 text-xs font-bold py-1 px-2 rounded-lg mt-2">Parada #${order}</div>`
          : `<p class="text-xs text-slate-500 mt-2">Clic para agregar</p>`
        }
      `;

      marker.bindPopup(popupContent, { className: 'rounded-xl' });
      
      marker.on('click', () => {
        if (!isSelected) {
          addNode(paradero);
        } else {
          removeNode(paradero.paradero_id as number);
        }
      });

      markersGroup.addLayer(marker);
    });

    // Update polyline
    const polylinePositions: L.LatLngTuple[] = nodes.map(n => [
      Number(n.paraderoData?.latitud),
      Number(n.paraderoData?.longitud)
    ]);
    polyline.setLatLngs(polylinePositions);

    // Update bounds
    if (nodes.length > 0) {
      const bounds = L.latLngBounds(polylinePositions);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (allParaderos.length > 0) {
      const bounds = L.latLngBounds(allParaderos.map(p => [Number(p.latitud), Number(p.longitud)]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }

  }, [nodes, allParaderos, addNode, removeNode]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (nodes.length < 3) {
      alert('Debes seleccionar al menos 3 paraderos en el mapa para trazar la ruta.');
      return;
    }
    
    try {
      await saveRoute({ nombre, descripcion, tarifa });
      alert('¡Ruta creada exitosamente!');
      navigate('/app'); // Redirect somewhere after success
    } catch (err) {
      // Error handled by hook, displayed in UI
    }
  };



  return (
    <div className="flex flex-col h-[calc(100vh-100px)] gap-6">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Crear Nueva Ruta</h1>
            <p className="text-slate-500 text-sm mt-1">Diseña el trayecto seleccionando los paraderos en el mapa</p>
         </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center justify-between">
           <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
           </div>
           <button onClick={clearError} className="p-1 hover:bg-rose-100 rounded">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        
        {/* Left Panel: Form & Nodes */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
           <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
             <form id="route-form" onSubmit={handleSave} className="space-y-5">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Nombre de la Ruta</label>
                  <input 
                    required
                    type="text"
                    value={nombre}
                    onChange={e => setNombre(e.target.value)}
                    placeholder="Ej. Transversal 1"
                    className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Tarifa General ($)</label>
                  <input 
                    required
                    type="number"
                    step="100"
                    min="0"
                    value={tarifa}
                    onChange={e => setTarifa(e.target.value)}
                    className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                  />
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Descripción</label>
                  <textarea 
                    value={descripcion}
                    onChange={e => setDescripcion(e.target.value)}
                    rows={2}
                    placeholder="Ruta principal occidente a oriente..."
                    className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                  />
               </div>
             </form>

             <hr className="my-6 border-slate-100" />

             <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800">Trayecto Seleccionado</h3>
                <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full">
                  {nodes.length} / 3 min
                </span>
             </div>

             {nodes.length === 0 ? (
               <div className="text-center p-8 border-2 border-dashed border-slate-200 rounded-2xl">
                 <svg className="w-8 h-8 text-slate-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                 <p className="text-sm text-slate-500 font-medium">Haz clic en los paraderos del mapa en el orden deseado</p>
               </div>
             ) : (
               <div className="space-y-3 relative before:absolute before:inset-0 before:ml-[1.4rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {nodes.map((node, i) => (
                    <div key={node.paraderoId} className="relative flex items-start justify-between bg-white border border-slate-200 p-4 rounded-2xl shadow-sm group">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-sm z-10 outline outline-4 outline-white">
                             {node.orden}
                          </div>
                          <div>
                             <p className="font-bold text-slate-800 text-sm">{node.paraderoData?.nombre}</p>
                             
                             <div className="flex items-center gap-2 mt-2">
                               {i > 0 && (
                                 <div className="flex items-center bg-slate-50 px-2 py-1 rounded text-xs">
                                   <span className="text-slate-400 mr-1">Dist:</span>
                                   <input 
                                     type="number"
                                     step="0.1"
                                     value={node.distanciaDesdeAnterior}
                                     onChange={e => updateNodeDistance(node.paraderoId, e.target.value)}
                                     className="w-12 bg-transparent border-b border-slate-300 focus:border-indigo-500 focus:outline-none px-1"
                                   />
                                   <span className="text-slate-500 ml-1">km</span>
                                 </div>
                               )}
                               
                               <div className="flex items-center bg-slate-50 px-2 py-1 rounded text-xs">
                                 <span className="text-slate-400 mr-1">Tiempo:</span>
                                 <input 
                                   type="number"
                                   value={node.tiempoEstimado}
                                   onChange={e => updateNodeTime(node.paraderoId, parseInt(e.target.value))}
                                   className="w-10 bg-transparent border-b border-slate-300 focus:border-indigo-500 focus:outline-none px-1"
                                 />
                                 <span className="text-slate-500 ml-1">min</span>
                               </div>
                             </div>
                          </div>
                       </div>
                       <button 
                         onClick={() => removeNode(node.paraderoId)}
                         className="text-slate-300 hover:text-rose-500 transition-colors p-1 opacity-0 group-hover:opacity-100"
                         title="Remover"
                       >
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                       </button>
                    </div>
                  ))}
               </div>
             )}
           </div>

           <div className="p-4 border-t border-slate-100 bg-slate-50">
              <button 
                type="submit" 
                form="route-form"
                disabled={isSaving || nodes.length < 3}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
                    Guardar Ruta Completa
                  </>
                )}
              </button>
           </div>
        </div>

        {/* Right Panel: Interactive Map */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden relative min-h-[400px]">
           {loadingParaderos ? (
             <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
             </div>
           ) : (
             <div 
               id="admin-route-map"
               style={{ height: '100%', width: '100%', zIndex: 0 }}
             ></div>
           )}

           {/* Floating Map Legend */}
           <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-slate-100 z-[1000] text-xs font-medium space-y-2">
              <div className="flex items-center gap-2">
                 <img src={defaultIcon.options.iconUrl} alt="marker" className="w-4" />
                 <span className="text-slate-600">Paradero Disponible</span>
              </div>
              <div className="flex items-center gap-2">
                 <img src={selectedIcon.options.iconUrl} alt="marker" className="w-4" />
                 <span className="text-slate-600">Paradero Seleccionado</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRouteCreatePage;
