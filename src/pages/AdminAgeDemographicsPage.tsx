import { useState, useEffect, useMemo } from 'react';
import { reportesService } from '../services/business/reportesService';
import type { PasajerosPorEdadReporte } from '../services/business/reportesService';
import { rutaService } from '../services/business/rutaService';
import type { Ruta } from '../models';

export const AdminAgeDemographicsPage = () => {
  const [data, setData] = useState<PasajerosPorEdadReporte | null>(null);
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedRutaId, setSelectedRutaId] = useState<number | ''>('');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  // Interactive slice state
  const [activeSegmentIndex, setActiveSegmentIndex] = useState<number | null>(null);

  useEffect(() => {
    // Load routes for filter
    rutaService.getAll().then(res => {
      setRutas(res);
    }).catch(() => {
      // ignore
    });
  }, []);

  useEffect(() => {
    fetchData();
  }, [selectedRutaId, fechaInicio, fechaFin]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await reportesService.pasajerosPorEdad(
        selectedRutaId ? Number(selectedRutaId) : undefined,
        fechaInicio || undefined,
        fechaFin || undefined
      );
      setData(res);
      setActiveSegmentIndex(null);
    } catch (err: any) {
      setError(err.message || 'Error cargando demografía');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data || !data.rangos.length) return;
    
    const headers = ['Rango Etario', 'Cantidad de Pasajeros', 'Porcentaje (%)', 'Variacion vs Mes Anterior'];
    const rows = data.rangos.map(r => [
      r.nombre,
      r.cantidad.toString(),
      r.porcentaje.toString(),
      r.variacionMesAnterior.toString()
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `demografia_pasajeros.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Color map for age ranges
  const getColor = (nombre: string) => {
    switch (nombre) {
      case 'Menores': return '#38bdf8'; // sky-400
      case 'Jóvenes': return '#a78bfa'; // violet-400
      case 'Adultos jóvenes': return '#fb7185'; // rose-400
      case 'Adultos': return '#f59e0b'; // amber-500
      case 'Adultos mayores': return '#34d399'; // emerald-400
      case 'Sin información': return '#94a3b8'; // slate-400
      default: return '#cbd5e1'; // slate-300
    }
  };

  // Generate SVG Pie Paths
  const piePaths = useMemo(() => {
    if (!data) return [];
    
    let currentAngle = -90; // Start at top (12 o'clock)
    const totalPercentage = data.rangos.reduce((sum, r) => sum + r.porcentaje, 0);
    
    // Normalize percentages in case they don't exactly add up to 100 due to rounding
    const normalizedRangos = data.rangos.map(r => ({
      ...r,
      normalizedPct: totalPercentage > 0 ? (r.porcentaje / totalPercentage) * 100 : 0
    }));

    return normalizedRangos.map((r, i) => {
      // Calculate arc
      const sliceAngle = (r.normalizedPct / 100) * 360;
      
      // If the slice is exactly 360, SVG arc commands break, we draw a full circle
      if (sliceAngle >= 359.9) {
        return {
          ...r,
          index: i,
          isFullCircle: true,
          color: getColor(r.nombre),
          d: ''
        };
      }

      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;
      
      // Calculate coordinates (center is 100,100, radius is 80)
      const x1 = 100 + 80 * Math.cos((Math.PI * startAngle) / 180);
      const y1 = 100 + 80 * Math.sin((Math.PI * startAngle) / 180);
      
      const x2 = 100 + 80 * Math.cos((Math.PI * endAngle) / 180);
      const y2 = 100 + 80 * Math.sin((Math.PI * endAngle) / 180);
      
      // Large arc flag is 1 if angle > 180
      const largeArcFlag = sliceAngle > 180 ? 1 : 0;
      
      // Draw path: move to center, line to start, arc to end, close path
      const d = `M 100 100 L ${x1} ${y1} A 80 80 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
      
      currentAngle += sliceAngle;
      
      return {
        ...r,
        index: i,
        isFullCircle: false,
        color: getColor(r.nombre),
        d
      };
    });
  }, [data]);

  const activeSegment = activeSegmentIndex !== null && data ? data.rangos[activeSegmentIndex] : null;

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
             </div>
             <h1 className="text-2xl font-black text-slate-800 tracking-tight">Demografía de Pasajeros</h1>
          </div>
          <p className="text-slate-500 text-sm ml-10">Análisis de segmentos etarios para estrategias de marketing y tarifas.</p>
        </div>

        <button 
          onClick={exportToCSV}
          disabled={loading || !data?.rangos.length}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-500/20"
        >
           <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
           Exportar Datos
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Ruta Específica</label>
          <select 
            value={selectedRutaId} 
            onChange={(e) => setSelectedRutaId(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:border-indigo-500 focus:ring-0"
          >
            <option value="">Consolidado del Sistema (Todas)</option>
            {rutas.map(r => (
              <option key={r.ruta_id} value={r.ruta_id}>{r.nombre}</option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fecha Inicio</label>
          <input 
            type="date" 
            value={fechaInicio} 
            onChange={e => setFechaInicio(e.target.value)} 
            className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:border-indigo-500 focus:ring-0"
          />
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Fecha Fin</label>
          <input 
            type="date" 
            value={fechaFin} 
            onChange={e => setFechaFin(e.target.value)} 
            className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:border-indigo-500 focus:ring-0"
          />
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative min-h-[400px]">
        
        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-20 rounded-3xl">
             <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
             <p className="text-indigo-900 font-bold text-sm">Analizando datos demográficos...</p>
          </div>
        )}

        {/* Gráfico y Segmento Predominante */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col items-center justify-center relative min-h-[350px]">
             
             {data?.segmentoPredominante && (
               <div className="absolute top-4 left-4 bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2 border border-indigo-100 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                  Predominante: {data.segmentoPredominante}
               </div>
             )}

             {data?.rangos && data.rangos.reduce((s, r) => s + r.cantidad, 0) > 0 ? (
               <div className="relative w-64 h-64 mt-8">
                 <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90 origin-center drop-shadow-xl filter">
                    {piePaths.map((slice) => (
                      slice.isFullCircle ? (
                         <circle
                           key={slice.nombre}
                           cx="100" cy="100" r="80"
                           fill={slice.color}
                           className="transition-all duration-300 cursor-pointer hover:opacity-80"
                           onClick={() => setActiveSegmentIndex(slice.index)}
                         />
                      ) : (
                         <path
                           key={slice.nombre}
                           d={slice.d}
                           fill={slice.color}
                           className={`transition-all duration-300 cursor-pointer stroke-white stroke-2 hover:opacity-80 ${activeSegmentIndex === slice.index ? 'scale-105 origin-center' : ''}`}
                           onClick={() => setActiveSegmentIndex(slice.index)}
                           onMouseEnter={() => setActiveSegmentIndex(slice.index)}
                           onMouseLeave={() => setActiveSegmentIndex(null)}
                         />
                      )
                    ))}
                    {/* Donut hole for a modern look */}
                    <circle cx="100" cy="100" r="40" fill="white" />
                 </svg>

                 {/* Center Info inside Donut */}
                 <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-8">
                    {activeSegment ? (
                       <div className="text-center animate-in fade-in zoom-in duration-200">
                          <p className="text-[10px] font-bold text-slate-500 uppercase">{activeSegment.nombre}</p>
                          <p className="text-xl font-black text-slate-800">{activeSegment.porcentaje}%</p>
                          <p className="text-xs font-semibold" style={{ color: getColor(activeSegment.nombre) }}>
                            {activeSegment.cantidad} pax
                          </p>
                       </div>
                    ) : (
                       <div className="text-center text-slate-400">
                          <svg className="w-6 h-6 mx-auto mb-1 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                          <p className="text-[9px] font-bold uppercase tracking-widest">Pasa el cursor</p>
                       </div>
                    )}
                 </div>
               </div>
             ) : (
               <div className="text-center text-slate-400">
                  <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                  <p className="text-sm font-bold">Sin datos para graficar</p>
               </div>
             )}
          </div>
        </div>

        {/* Tabla Analítica */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm overflow-hidden flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4 border-b border-slate-100 pb-4">Detalle por Segmento Etario</h3>
          
          <div className="overflow-x-auto flex-1">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead>
                   <tr className="text-slate-500 font-bold uppercase tracking-wider text-[10px] border-b-2 border-slate-100">
                      <th className="pb-3 pl-2">Segmento</th>
                      <th className="pb-3 px-4 text-right">Pasajeros (Absoluto)</th>
                      <th className="pb-3 px-4 text-right">Participación (%)</th>
                      <th className="pb-3 pr-2 text-right">Variación Mes Ant.</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                   {data?.rangos.map((r, i) => {
                      const isPredominant = r.nombre === data.segmentoPredominante;
                      const variationColor = r.variacionMesAnterior > 0 ? 'text-emerald-500' : r.variacionMesAnterior < 0 ? 'text-rose-500' : 'text-slate-400';
                      const variationSign = r.variacionMesAnterior > 0 ? '+' : '';

                      return (
                         <tr 
                           key={r.nombre} 
                           className={`transition-colors hover:bg-slate-50 ${activeSegmentIndex === i ? 'bg-slate-50 shadow-inner' : ''}`}
                           onMouseEnter={() => setActiveSegmentIndex(i)}
                           onMouseLeave={() => setActiveSegmentIndex(null)}
                         >
                            <td className="py-4 pl-2 font-medium flex items-center gap-3">
                               <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: getColor(r.nombre) }}></span>
                               <span className={isPredominant ? 'text-indigo-900 font-bold' : 'text-slate-700'}>
                                 {r.nombre}
                               </span>
                               {isPredominant && (
                                 <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
                               )}
                            </td>
                            <td className="py-4 px-4 text-right font-mono text-slate-800">{r.cantidad.toLocaleString()}</td>
                            <td className="py-4 px-4 text-right">
                               <div className="flex items-center justify-end gap-2">
                                  <span className="font-bold text-slate-800">{r.porcentaje}%</span>
                                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                     <div className="h-full rounded-full" style={{ width: `${r.porcentaje}%`, backgroundColor: getColor(r.nombre) }}></div>
                                  </div>
                               </div>
                            </td>
                            <td className="py-4 pr-2 text-right">
                               <span className={`font-bold text-xs bg-slate-50 px-2 py-1 rounded-lg border border-slate-100 ${variationColor}`}>
                                  {variationSign}{r.variacionMesAnterior}
                               </span>
                            </td>
                         </tr>
                      );
                   })}
                   
                   {(!data || data.rangos.length === 0) && (
                      <tr>
                         <td colSpan={4} className="py-8 text-center text-slate-400 text-sm">No hay datos para mostrar</td>
                      </tr>
                   )}
                </tbody>
             </table>
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] text-slate-400 text-center uppercase tracking-widest font-bold">
            Total de Registros Analizados: {data?.rangos.reduce((s, r) => s + r.cantidad, 0).toLocaleString() || 0}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminAgeDemographicsPage;
