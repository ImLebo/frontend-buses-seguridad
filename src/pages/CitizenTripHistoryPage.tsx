import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useCitizenTrips } from '../hooks/business/useCitizenTrips';

export const CitizenTripHistoryPage = () => {
  const {
    trips,
    loading,
    error,
    selectedTripId,
    recorridoInfo,
    recorridoLoading,
    recorridoError,
    loadRecorrido,
    clearSelection,
  } = useCitizenTrips();

  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('citizen-history-map', {
        zoomControl: true,
        fadeAnimation: true,
      }).setView([4.60971, -74.08175], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        layerGroupRef.current = null;
      }
    };
  }, []);

  // Update Markers and Polyline on Map when recorridoInfo changes
  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    if (!recorridoInfo || !recorridoInfo.ruta || !recorridoInfo.ruta.paraderos) {
      return;
    }

    const latLngs: L.LatLngTuple[] = [];

    const sortedParaderos = [...recorridoInfo.ruta.paraderos].sort((a, b) => a.orden - b.orden);

    const createMarkerIcon = (orden: number, name: string, isAbordaje: boolean, isDescenso: boolean) => {
      let bgColor = 'bg-slate-500'; // Paradero normal
      let pulse = '';
      let scale = 'scale-100';
      let zIndexOffset = 0;
      let extraClass = '';

      if (isAbordaje) {
        bgColor = 'bg-emerald-500';
        pulse = '<span class="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>';
        scale = 'scale-110';
        zIndexOffset = 1000;
        extraClass = 'ring-4 ring-emerald-500/30';
      } else if (isDescenso) {
        bgColor = 'bg-rose-500';
        pulse = '<span class="absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75 animate-ping"></span>';
        scale = 'scale-110';
        zIndexOffset = 1000;
        extraClass = 'ring-4 ring-rose-500/30';
      }

      return L.divIcon({
        html: `
          <div class="relative flex items-center justify-center w-8 h-8 rounded-full ${bgColor} ${extraClass} text-white font-bold border-2 border-white shadow-lg group transition-transform duration-200 ${scale} hover:scale-125 z-[${zIndexOffset}]">
            ${pulse}
            <span class="relative z-10 text-xs">${orden}</span>
            <div class="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap z-[1000]">
              ${name} ${isAbordaje ? '(Abordaje)' : isDescenso ? '(Descenso)' : ''}
            </div>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    };

    const abordajeId = recorridoInfo.paraderoAbordaje?.paradero?.paradero_id;
    const descensoId = recorridoInfo.paraderoDescenso?.paradero?.paradero_id;

    sortedParaderos.forEach((pr) => {
      const lat = parseFloat(pr.paradero.latitud as any);
      const lng = parseFloat(pr.paradero.longitud as any);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        const coords: L.LatLngTuple = [lat, lng];
        latLngs.push(coords);

        const isAbordaje = pr.paradero.paradero_id === abordajeId;
        const isDescenso = pr.paradero.paradero_id === descensoId;

        const marker = L.marker(coords, {
          icon: createMarkerIcon(pr.orden, pr.paradero.nombre, isAbordaje, isDescenso),
          zIndexOffset: isAbordaje || isDescenso ? 1000 : 0,
        });

        const timeHtml = isAbordaje && recorridoInfo.horaAbordaje 
          ? `<p class="text-[10px] text-emerald-600 font-bold mt-1">Hora Abordaje: ${new Date(recorridoInfo.horaAbordaje).toLocaleTimeString()}</p>`
          : isDescenso && recorridoInfo.horaDescenso
          ? `<p class="text-[10px] text-rose-600 font-bold mt-1">Hora Descenso: ${new Date(recorridoInfo.horaDescenso).toLocaleTimeString()}</p>`
          : '';

        marker.bindPopup(`
          <div class="p-2 font-sans min-w-[150px]">
            <p class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Parada #${pr.orden}</p>
            <h3 class="text-xs font-semibold text-slate-800 mt-0 mb-1">${pr.paradero.nombre}</h3>
            ${timeHtml}
          </div>
        `);

        layerGroupRef.current?.addLayer(marker);
      }
    });

    if (latLngs.length > 0) {
      const polyline = L.polyline(latLngs, {
        color: '#4f46e5',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10',
      });
      layerGroupRef.current.addLayer(polyline);

      const bounds = L.latLngBounds(latLngs);
      mapRef.current.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [recorridoInfo]);

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-140px)]">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Historial de Viajes</h2>
        <p className="text-sm text-slate-600">
          Consulta los recorridos detallados de tus viajes realizados.
        </p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Side: Trips List */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-1">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm flex-1">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 mt-3 font-medium">Cargando historial...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm shadow-sm">
              <p className="font-semibold">Error al cargar viajes</p>
              <p className="text-xs mt-1 text-rose-600">{error}</p>
            </div>
          ) : trips.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm text-center flex-1">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="text-slate-800 font-semibold mt-3 text-sm">No tienes viajes completados</h4>
              <p className="text-slate-500 text-xs mt-1">Aborda un bus para que aparezcan en tu historial.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {trips.map((trip) => {
                const isSelected = selectedTripId === trip.boleto_id;
                const fecha = trip.inicio_viaje ? new Date(trip.inicio_viaje).toLocaleDateString() : '';
                return (
                  <div
                    key={trip.boleto_id}
                    onClick={() => {
                      if (!isSelected) loadRecorrido(trip.boleto_id as number);
                      else clearSelection();
                    }}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-indigo-200 shadow-md ring-1 ring-indigo-500/10'
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
                        }`}>
                          #{trip.boleto_id}
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">{trip.programacion?.ruta?.nombre || 'Ruta'}</h3>
                      </div>
                      <span className="text-xs font-semibold text-slate-500">
                        {fecha}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-1">
                      Costo: <span className="font-bold text-emerald-600">${trip.costo}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Leaflet Map & Details */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white border border-slate-100 rounded-2xl shadow-sm p-3 relative min-h-[450px]">
          
          {/* Map */}
          <div id="citizen-history-map" className="w-full h-full rounded-xl z-0" />
          
          {/* Overlay Stats (Only when recorrido is selected) */}
          {recorridoInfo && (
            <div className="absolute top-6 right-6 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-200 max-w-sm pointer-events-auto">
              <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-2 mb-3">Detalles del Viaje</h4>
              
              <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs">
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Bus (Placa)</p>
                  <p className="font-semibold text-slate-800">{recorridoInfo.placaBus || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Conductor</p>
                  <p className="font-semibold text-slate-800 line-clamp-1">{recorridoInfo.conductor || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hora de Abordaje</p>
                  <p className="font-semibold text-emerald-600">
                    {recorridoInfo.horaAbordaje ? new Date(recorridoInfo.horaAbordaje).toLocaleTimeString() : '--:--'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Hora de Descenso</p>
                  <p className="font-semibold text-rose-600">
                    {recorridoInfo.horaDescenso ? new Date(recorridoInfo.horaDescenso).toLocaleTimeString() : '--:--'}
                  </p>
                </div>
                <div className="col-span-2 mt-1">
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider text-center">Tiempo Total de Viaje</p>
                  <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-lg p-2 mt-1 text-center font-bold">
                    {recorridoInfo.tiempoTotalMinutos != null ? `${recorridoInfo.tiempoTotalMinutos} minutos` : 'Desconocido'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {recorridoLoading && (
             <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-sm rounded-2xl flex items-center justify-center z-[2000]">
               <div className="bg-white p-4 rounded-full shadow-lg">
                  <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
               </div>
             </div>
          )}

          {!selectedTripId && !recorridoLoading && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs rounded-2xl flex items-center justify-center z-10 p-6 text-center">
              <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h4 className="text-slate-800 font-bold text-sm">Selecciona un viaje</h4>
                <p className="text-slate-500 text-xs mt-1">
                  Haz clic en un viaje de tu historial para visualizar el mapa de la ruta, paraderos validados y tiempos exactos.
                </p>
              </div>
            </div>
          )}

          {recorridoError && (
             <div className="absolute inset-0 bg-rose-900/20 backdrop-blur-sm rounded-2xl flex items-center justify-center z-[2000]">
               <div className="bg-white p-4 rounded-xl shadow-lg border border-rose-200">
                  <p className="text-rose-600 font-bold text-sm">Error</p>
                  <p className="text-slate-600 text-xs mt-1">{recorridoError}</p>
               </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenTripHistoryPage;
