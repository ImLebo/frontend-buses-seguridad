import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRutaDisponible } from '../hooks/business/useRutaDisponible';
import type { RutaDisponible } from '../models';

export const CitizenRoutesPage = () => {
  const [filter, setFilter] = useState('');
  const { data: routes, loading, error } = useRutaDisponible(filter);
  const [selectedRoute, setSelectedRoute] = useState<RutaDisponible | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) {
      // Coordenadas iniciales por defecto (por ejemplo, centro de una ciudad)
      const map = L.map('citizen-map', {
        zoomControl: true,
        fadeAnimation: true,
      }).setView([4.60971, -74.08175], 12); // Centro inicial por defecto

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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

  // Update Markers and Polyline on Map when Selected Route changes
  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) return;

    // Clear previous markers/polylines
    layerGroupRef.current.clearLayers();

    if (!selectedRoute || !selectedRoute.paraderos || selectedRoute.paraderos.length === 0) {
      return;
    }

    const latLngs: L.LatLngTuple[] = [];

    // Sort paraderos by order
    const sortedParaderos = [...selectedRoute.paraderos].sort((a, b) => a.orden - b.orden);

    // Custom Leaflet DivIcon for premium markers with sequence numbers
    const createMarkerIcon = (orden: number, name: string) => {
      const isFirst = orden === 1;
      const isLast = orden === sortedParaderos.length;
      
      let bgColor = 'bg-indigo-600';
      if (isFirst) bgColor = 'bg-emerald-600';
      if (isLast) bgColor = 'bg-rose-600';

      return L.divIcon({
        html: `
          <div class="flex items-center justify-center w-8 h-8 rounded-full ${bgColor} text-white font-bold border-2 border-white shadow-lg relative group transition-transform duration-200 hover:scale-110">
            <span class="text-xs">${orden}</span>
            <div class="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap z-[1000]">
              ${name}
            </div>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    };

    sortedParaderos.forEach((pr) => {
      const lat = parseFloat(pr.paradero.latitud as string);
      const lng = parseFloat(pr.paradero.longitud as string);
      if (!isNaN(lat) && !isNaN(lng)) {
        const coords: L.LatLngTuple = [lat, lng];
        latLngs.push(coords);

        const marker = L.marker(coords, {
          icon: createMarkerIcon(pr.orden, pr.paradero.nombre),
        });

        // HTML content for standard Leaflet Popup
        marker.bindPopup(`
          <div class="p-2 font-sans min-w-[150px]">
            <p class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider mb-0.5">Parada #${pr.orden}</p>
            <h3 class="text-xs font-semibold text-slate-800 mt-0 mb-1">${pr.paradero.nombre}</h3>
            ${pr.paradero.descripcion ? `<p class="text-[11px] text-slate-500 mt-1 mb-0">${pr.paradero.descripcion}</p>` : ''}
          </div>
        `);

        layerGroupRef.current?.addLayer(marker);
      }
    });

    if (latLngs.length > 0) {
      // Polyline for sequential paraderos path
      const polyline = L.polyline(latLngs, {
        color: '#4f46e5', // Indigo-600
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10', // Dashed bus route
      });
      layerGroupRef.current.addLayer(polyline);

      // Fit bounds
      const bounds = L.latLngBounds(latLngs);
      mapRef.current.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [selectedRoute]);

  const handleSelectRoute = (route: RutaDisponible) => {
    setSelectedRoute(route);
  };

  const formatFare = (fare: string | number) => {
    const value = typeof fare === 'string' ? parseFloat(fare) : fare;
    if (isNaN(value)) return '$0.00';
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-140px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Rutas Disponibles</h2>
          <p className="text-sm text-slate-600">Busca y selecciona una ruta para ver su recorrido y paraderos.</p>
        </div>
        <div className="w-full md:w-80">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Buscar por nombre de ruta..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Side: Routes List & Details */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-1">
          {loading && routes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm flex-1">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 mt-3 font-medium">Buscando rutas...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm shadow-sm">
              <p className="font-semibold">Error al cargar rutas</p>
              <p className="text-xs mt-1 text-rose-600">{error}</p>
            </div>
          ) : routes.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm text-center flex-1">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h4 className="text-slate-800 font-semibold mt-3 text-sm">No se encontraron rutas</h4>
              <p className="text-slate-500 text-xs mt-1">Prueba a buscar con otro nombre.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {routes.map((route) => {
                const isSelected = selectedRoute?.ruta_id === route.ruta_id;
                return (
                  <div
                    key={route.ruta_id}
                    onClick={() => handleSelectRoute(route)}
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
                          BUS
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm">{route.nombre}</h3>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100">
                        {formatFare(route.tarifa)}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                      {route.descripcion || 'Sin descripción disponible.'}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        ⏱ {route.tiempo_estimado_total_min} min
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        📍 {route.paraderos?.length || 0} paradas
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sequential Stops list of selected route */}
          {selectedRoute && selectedRoute.paraderos?.length > 0 && (
            <div className="mt-2 bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col gap-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Recorrido secuencial</h3>
              <div className="relative border-l-2 border-indigo-100 pl-4 ml-2.5 flex flex-col gap-4">
                {[...selectedRoute.paraderos]
                  .sort((a, b) => a.orden - b.orden)
                  .map((pr, idx, arr) => {
                    const isFirst = idx === 0;
                    const isLast = idx === arr.length - 1;
                    return (
                      <div key={pr.paradero.paradero_id} className="relative group">
                        {/* Bullet */}
                        <span className={`absolute -left-[23px] top-0.5 w-3 h-3 rounded-full border-2 border-white shadow ${
                          isFirst ? 'bg-emerald-500 ring-4 ring-emerald-50' : isLast ? 'bg-rose-500 ring-4 ring-rose-50' : 'bg-indigo-500'
                        }`} />
                        <div>
                          <p className="text-xs font-bold text-slate-800 leading-tight">
                            {pr.orden}. {pr.paradero.nombre}
                          </p>
                          {pr.paradero.descripcion && (
                            <p className="text-[10px] text-slate-500 mt-0.5">{pr.paradero.descripcion}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Leaflet Map */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white border border-slate-100 rounded-2xl shadow-sm p-3 relative min-h-[350px]">
          <div id="citizen-map" className="w-full h-full rounded-xl z-0" />
          
          {!selectedRoute && (
            <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs rounded-2xl flex items-center justify-center z-10 p-6 text-center">
              <div className="bg-white p-6 rounded-2xl shadow-xl max-w-sm">
                <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h4 className="text-slate-800 font-bold text-sm">Selecciona una ruta</h4>
                <p className="text-slate-500 text-xs mt-1">
                  Elige una ruta disponible del listado izquierdo para visualizar su recorrido y paradas secuenciales en el mapa interactivo.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CitizenRoutesPage;
