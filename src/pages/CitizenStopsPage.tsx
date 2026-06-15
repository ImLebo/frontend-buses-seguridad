import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useParaderosCercanos } from '../hooks/business/useParaderosCercanos';
import type { ParaderoCercano } from '../services/business/paraderoService';

export const CitizenStopsPage = () => {
  const [radio, setRadio] = useState(1000); // 1km default
  const { data: stops, loading, error, permissionState, userLocation, refresh } = useParaderosCercanos(radio);
  const [selectedStop, setSelectedStop] = useState<ParaderoCercano | null>(null);

  const mapRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const circleRef = useRef<L.Circle | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map('stops-map', {
        zoomControl: true,
        fadeAnimation: true,
      }).setView([4.60971, -74.08175], 14);

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
        userMarkerRef.current = null;
        circleRef.current = null;
      }
    };
  }, []);

  // Update User Location and Circle
  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const { lat, lng } = userLocation;

    // Pulse dot for current location
    const pulseIcon = L.divIcon({
      html: `
        <div class="relative flex h-6 w-6">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-4 w-4 bg-sky-500 border-2 border-white shadow-lg m-1"></span>
        </div>
      `,
      className: 'gps-pulse-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([lat, lng]);
    } else {
      userMarkerRef.current = L.marker([lat, lng], { icon: pulseIcon })
        .bindPopup('<div class="font-sans font-bold text-xs p-1">Tu ubicación actual</div>')
        .addTo(mapRef.current);
    }

    // Radius circle
    if (circleRef.current) {
      circleRef.current.setLatLng([lat, lng]);
      circleRef.current.setRadius(radio);
    } else {
      circleRef.current = L.circle([lat, lng], {
        radius: radio,
        color: '#3b82f6',
        fillColor: '#3b82f6',
        fillOpacity: 0.1,
        weight: 1.5,
      }).addTo(mapRef.current);
    }

    // Only pan if we haven't selected a stop or if it's the first render
    if (!selectedStop) {
      mapRef.current.setView([lat, lng], 15);
    }
  }, [userLocation, radio, selectedStop]);

  // Update Stops Markers
  useEffect(() => {
    if (!mapRef.current || !layerGroupRef.current) return;

    layerGroupRef.current.clearLayers();

    if (!stops || stops.length === 0) return;

    stops.forEach((sc, idx) => {
      const lat = Number(sc.paradero.latitud);
      const lng = Number(sc.paradero.longitud);
      if (!isNaN(lat) && !isNaN(lng)) {
        const markerIcon = L.divIcon({
          html: `
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold border-2 border-white shadow-lg relative group transition-transform duration-200 hover:scale-110">
              <span class="text-xs">${idx + 1}</span>
              <div class="absolute bottom-full mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded shadow-md whitespace-nowrap z-[1000]">
                ${sc.paradero.nombre} (${sc.distancia_m} m)
              </div>
            </div>
          `,
          className: 'stop-marker-icon',
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });

        const marker = L.marker([lat, lng], { icon: markerIcon });

        const routesList = sc.rutas && sc.rutas.length > 0
          ? sc.rutas.map((r) => `<span class="inline-block bg-indigo-50 text-indigo-700 font-semibold text-[10px] px-2 py-0.5 rounded mr-1 mb-1">${r.nombre}</span>`).join('')
          : '<span class="text-slate-400 text-[10px]">Ninguna ruta registrada</span>';

        marker.bindPopup(`
          <div class="p-2 font-sans min-w-[160px]">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Paradero #${idx + 1}</p>
            <h3 class="text-xs font-semibold text-slate-800 mt-0 mb-1">${sc.paradero.nombre}</h3>
            <p class="text-[11px] font-medium text-emerald-600 mb-2">A ${sc.distancia_m} metros</p>
            <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Rutas que pasan:</p>
            <div class="flex flex-wrap mt-1">${routesList}</div>
          </div>
        `);

        // If this stop is currently selected, open its popup
        if (selectedStop?.paradero.paradero_id === sc.paradero.paradero_id) {
          setTimeout(() => {
            marker.openPopup();
          }, 100);
        }

        layerGroupRef.current?.addLayer(marker);
      }
    });

    // Auto-fit bounds of stops + user location to show everything nicely
    if (userLocation) {
      const points: L.LatLngTuple[] = [[userLocation.lat, userLocation.lng]];
      stops.forEach((s) => {
        const slat = Number(s.paradero.latitud);
        const slng = Number(s.paradero.longitud);
        if (!isNaN(slat) && !isNaN(slng)) {
          points.push([slat, slng]);
        }
      });
      const bounds = L.latLngBounds(points);
      mapRef.current.fitBounds(bounds, { padding: [60, 60] });
    }
  }, [stops, selectedStop, userLocation]);

  const handleSelectStop = (sc: ParaderoCercano) => {
    setSelectedStop(sc);
    const lat = Number(sc.paradero.latitud);
    const lng = Number(sc.paradero.longitud);
    if (mapRef.current && !isNaN(lat) && !isNaN(lng)) {
      mapRef.current.setView([lat, lng], 16, { animate: true });
    }
  };

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-140px)]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Paraderos Cercanos</h2>
          <p className="text-sm text-slate-600">Busca paraderos cerca de tu ubicación actual y mira qué rutas pasan por ellos.</p>
        </div>

        {/* Filters & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Radio Selector */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-xl shadow-sm text-sm">
            <span className="text-slate-500 font-medium text-xs">Radio:</span>
            <select
              value={radio}
              onChange={(e) => setRadio(parseInt(e.target.value))}
              className="bg-transparent font-semibold text-slate-700 focus:outline-none text-xs"
            >
              <option value={500}>500 metros</option>
              <option value={1000}>1 kilómetro</option>
              <option value={2000}>2 kilómetros</option>
              <option value={5000}>5 kilómetros</option>
            </select>
          </div>

          {/* Refresh Button */}
          <button
            onClick={refresh}
            disabled={!userLocation || loading}
            className="flex items-center justify-center p-2 bg-white border border-slate-200 hover:border-slate-300 rounded-xl text-slate-600 hover:text-slate-800 shadow-sm transition-all disabled:opacity-50"
            title="Refrescar ubicación y paraderos"
          >
            <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89H17" />
            </svg>
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
        {/* Left Side: Stops List */}
        <div className="lg:col-span-4 flex flex-col gap-4 overflow-y-auto pr-1">
          {permissionState === 'denied' ? (
            <div className="p-5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-center shadow-sm">
              <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 mx-auto mb-3">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-sm">Acceso a Ubicación Denegado</h4>
              <p className="text-xs text-rose-600 mt-2 leading-relaxed">
                Esta funcionalidad requiere acceso a tu ubicación GPS. Por favor, habilita los permisos de geolocalización en los ajustes de tu navegador y recarga la página.
              </p>
            </div>
          ) : !userLocation && loading ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm flex-1">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm text-slate-500 mt-3 font-medium">Obteniendo ubicación GPS...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm shadow-sm">
              <p className="font-semibold">Error de búsqueda</p>
              <p className="text-xs mt-1 text-rose-600">{error}</p>
              <button
                onClick={refresh}
                className="mt-3 px-3 py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-800 rounded-lg text-xs font-semibold transition-all"
              >
                Reintentar
              </button>
            </div>
          ) : stops.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-2xl shadow-sm text-center flex-1">
              <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              <h4 className="text-slate-800 font-semibold mt-3 text-sm font-bold">No se encontraron paraderos</h4>
              <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                No hay paraderos en un rango de {radio >= 1000 ? `${radio / 1000} km` : `${radio} m`}. Intenta aumentando el radio de búsqueda.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1">
                Los 5 paraderos más cercanos:
              </div>

              {stops.map((sc, idx) => {
                const isSelected = selectedStop?.paradero.paradero_id === sc.paradero.paradero_id;
                return (
                  <div
                    key={sc.paradero.paradero_id}
                    onClick={() => handleSelectStop(sc)}
                    className={`p-4 rounded-2xl cursor-pointer border transition-all duration-200 flex flex-col gap-2 ${
                      isSelected
                        ? 'bg-gradient-to-r from-indigo-50/80 to-purple-50/80 border-indigo-200 shadow-md ring-1 ring-indigo-500/10'
                        : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                          isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {idx + 1}
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm leading-tight">{sc.paradero.nombre}</h3>
                          <span className="text-[10px] text-slate-400 font-semibold uppercase">ID: {sc.paradero.paradero_id}</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 whitespace-nowrap">
                        {sc.distancia_m} m
                      </span>
                    </div>

                    {sc.paradero.direccion && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                        Dirección: {sc.paradero.direccion}
                      </p>
                    )}

                    <div className="mt-2 border-t border-slate-100/50 pt-2">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rutas que pasan por aquí:</p>
                      {sc.rutas && sc.rutas.length > 0 ? (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {sc.rutas.map((r) => (
                            <span
                              key={r.ruta_id}
                              className="inline-block bg-indigo-50 border border-indigo-100 text-indigo-700 font-semibold text-[10px] px-2 py-0.5 rounded-lg"
                            >
                              {r.nombre}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-[10px] text-slate-400 italic">No hay rutas asignadas a este paradero.</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Leaflet Map */}
        <div className="lg:col-span-8 flex flex-col h-full bg-white border border-slate-100 rounded-2xl shadow-sm p-3 relative min-h-[350px]">
          <div id="stops-map" className="w-full h-full rounded-xl z-0" />
        </div>
      </div>
    </div>
  );
};

export default CitizenStopsPage;
