import { useState, useEffect } from 'react';
import { reportesService } from '../services/business/reportesService';
import type { IngresosMetodoReporte } from '../services/business/reportesService';

export const AdminRevenueReportPage = () => {
  const [monthsFilter, setMonthsFilter] = useState<number>(6);
  const [data, setData] = useState<IngresosMetodoReporte[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData(monthsFilter);
  }, [monthsFilter]);

  const fetchData = async (meses: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await reportesService.ingresosPorMetodo(meses);
      setData(res);
    } catch (err: any) {
      setError(err.message || 'Error cargando datos del reporte');
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (!data.length) return;
    
    // Headers
    const headers = ['Mes', 'Efectivo (COP)', 'Tarjeta (COP)', 'Prepagado (COP)', 'Total (COP)'];
    
    // Rows
    const rows = data.map(d => [
      d.mes,
      d.metodos.efectivo || 0,
      d.metodos.tarjeta || 0,
      d.metodos.prepagado || 0,
      d.total || 0
    ]);
    
    // Convert to CSV
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.join(','))
    ].join('\n');
    
    // Create Blob and Download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ingresos_por_metodo_${monthsFilter}_meses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Find max total to normalize chart heights
  const maxTotal = data.reduce((max, item) => item.total > max ? item.total : max, 0) || 1;
  
  // Aggregate totals for the summary cards
  const totalEfectivo = data.reduce((sum, item) => sum + (item.metodos.efectivo || 0), 0);
  const totalTarjeta = data.reduce((sum, item) => sum + (item.metodos.tarjeta || 0), 0);
  const totalPrepagado = data.reduce((sum, item) => sum + (item.metodos.prepagado || 0), 0);
  const grandTotal = totalEfectivo + totalTarjeta + totalPrepagado;

  // Format month (e.g. 2026-06 to Jun 2026)
  const formatMonth = (yyyyMm: string) => {
    if (!yyyyMm) return '';
    const [year, month] = yyyyMm.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString('es-ES', { month: 'short', year: 'numeric' }).replace('.', '');
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8 pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <h1 className="text-2xl font-black text-slate-800 tracking-tight">Evolución de Ingresos</h1>
          </div>
          <p className="text-slate-500 text-sm ml-10">Análisis mensual de recaudación por método de pago.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100 p-1 rounded-xl flex items-center shadow-inner">
             {[3, 6, 12].map(m => (
               <button
                 key={m}
                 onClick={() => setMonthsFilter(m)}
                 className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                   monthsFilter === m 
                   ? 'bg-white text-indigo-600 shadow-sm' 
                   : 'text-slate-500 hover:text-slate-700'
                 }`}
               >
                 {m} Meses
               </button>
             ))}
          </div>

          <button 
            onClick={exportToCSV}
            disabled={loading || data.length === 0}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md shadow-indigo-500/20"
          >
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
             Exportar CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl text-sm font-medium">
          {error}
        </div>
      )}

      {/* Resumen Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
               <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.1-.96-2.15-1.71H8.04c.05 1.86 1.27 2.65 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/></svg>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Ingreso Total ({monthsFilter}m)</p>
            <h3 className="text-2xl font-black text-slate-800">${grandTotal.toLocaleString()}</h3>
            <p className="text-[10px] text-slate-400 mt-1">Suma de todos los canales</p>
         </div>
         
         <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-emerald-500"></div>
            <p className="text-emerald-700 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
               <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Efectivo
            </p>
            <h3 className="text-2xl font-black text-emerald-900">${totalEfectivo.toLocaleString()}</h3>
            <p className="text-[10px] text-emerald-600 mt-1 font-semibold">{grandTotal ? Math.round((totalEfectivo/grandTotal)*100) : 0}% del total</p>
         </div>

         <div className="bg-sky-50 p-5 rounded-2xl border border-sky-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-sky-500"></div>
            <p className="text-sky-700 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
               <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span> Tarjeta
            </p>
            <h3 className="text-2xl font-black text-sky-900">${totalTarjeta.toLocaleString()}</h3>
            <p className="text-[10px] text-sky-600 mt-1 font-semibold">{grandTotal ? Math.round((totalTarjeta/grandTotal)*100) : 0}% del total</p>
         </div>

         <div className="bg-purple-50 p-5 rounded-2xl border border-purple-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-2 h-full bg-purple-500"></div>
            <p className="text-purple-700 text-xs font-bold uppercase tracking-wider mb-1 flex items-center gap-1.5">
               <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span> Tarjeta Prepago
            </p>
            <h3 className="text-2xl font-black text-purple-900">${totalPrepagado.toLocaleString()}</h3>
            <p className="text-[10px] text-purple-600 mt-1 font-semibold">{grandTotal ? Math.round((totalPrepagado/grandTotal)*100) : 0}% del total</p>
         </div>
      </div>

      {/* Main Chart Area */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-10 rounded-3xl">
             <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
             <p className="text-indigo-900 font-bold text-sm">Calculando estadísticas...</p>
          </div>
        ) : data.length === 0 ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 text-slate-400">
             <svg className="w-12 h-12 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
             <p>No hay datos disponibles para el período seleccionado</p>
          </div>
        ) : null}

        {/* Y Axis Guides */}
        <div className="absolute top-8 left-8 bottom-16 right-8 flex flex-col justify-between pointer-events-none opacity-20">
           {[4,3,2,1,0].map(i => (
              <div key={i} className="border-b border-dashed border-slate-400 w-full relative">
                 <span className="absolute -left-12 -top-2 text-[10px] font-mono text-slate-600">${Math.round((maxTotal / 4) * i / 1000)}k</span>
              </div>
           ))}
        </div>

        {/* Bars Container */}
        <div className="h-[300px] w-full flex items-end justify-between pl-8 relative z-0 mt-8">
           {data.map((item) => {
              const hEfectivo = item.total > 0 ? (item.metodos.efectivo / maxTotal) * 100 : 0;
              const hTarjeta = item.total > 0 ? (item.metodos.tarjeta / maxTotal) * 100 : 0;
              const hPrepagado = item.total > 0 ? (item.metodos.prepagado / maxTotal) * 100 : 0;

              return (
                 <div key={item.mes} className="flex-1 flex flex-col items-center group relative h-full justify-end px-1 sm:px-4">
                    
                    {/* Tooltip Hover */}
                    <div className="absolute -top-16 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-xs p-3 rounded-xl shadow-xl pointer-events-none z-20 whitespace-nowrap">
                       <p className="font-bold border-b border-slate-700 pb-1 mb-1">{formatMonth(item.mes).toUpperCase()}</p>
                       <p className="flex justify-between gap-4"><span className="text-emerald-400">Efectivo:</span> <span>${item.metodos.efectivo.toLocaleString()}</span></p>
                       <p className="flex justify-between gap-4"><span className="text-sky-400">Tarjeta:</span> <span>${item.metodos.tarjeta.toLocaleString()}</span></p>
                       <p className="flex justify-between gap-4"><span className="text-purple-400">Prepago:</span> <span>${item.metodos.prepagado.toLocaleString()}</span></p>
                       <p className="flex justify-between gap-4 mt-1 pt-1 border-t border-slate-700 font-bold text-indigo-300"><span>Total:</span> <span>${item.total.toLocaleString()}</span></p>
                       {/* Tooltip triangle */}
                       <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 rotate-45"></div>
                    </div>

                    {/* Stacked Bar */}
                    <div className="w-full max-w-[60px] flex flex-col-reverse shadow-sm rounded-t-sm overflow-hidden group-hover:opacity-80 transition-opacity">
                       {/* Efectivo */}
                       <div 
                         style={{ height: `${hEfectivo}%` }} 
                         className="bg-emerald-500 w-full transition-all duration-1000 ease-out flex items-center justify-center hover:brightness-110 cursor-pointer"
                       ></div>
                       {/* Tarjeta */}
                       <div 
                         style={{ height: `${hTarjeta}%` }} 
                         className="bg-sky-500 w-full transition-all duration-1000 ease-out flex items-center justify-center hover:brightness-110 cursor-pointer border-b border-white/20"
                       ></div>
                       {/* Prepagado */}
                       <div 
                         style={{ height: `${hPrepagado}%` }} 
                         className="bg-purple-500 w-full transition-all duration-1000 ease-out flex items-center justify-center hover:brightness-110 cursor-pointer border-b border-white/20"
                       ></div>
                    </div>

                    {/* X Axis Label */}
                    <div className="mt-4 text-[10px] sm:text-xs font-bold text-slate-500 uppercase rotate-[-45deg] sm:rotate-0 origin-top-left whitespace-nowrap">
                       {formatMonth(item.mes)}
                    </div>
                 </div>
              );
           })}
        </div>

      </div>
    </div>
  );
};

export default AdminRevenueReportPage;
