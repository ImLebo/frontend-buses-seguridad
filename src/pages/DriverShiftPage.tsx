import { useState } from 'react';
import { useDriverShift } from '../hooks/business/useDriverShift';
import { ReportIncidentModal } from '../components/business/ReportIncidentModal';

export const DriverShiftPage = () => {
  const { driver, scheduledShifts, activeShift, loading, error, iniciarTurno, refreshData } = useDriverShift();
  
  const [busEstado, setBusEstado] = useState('operativo');
  const [observaciones, setObservaciones] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  const [isIncidentModalOpen, setIsIncidentModalOpen] = useState(false);

  const handleStartShift = async (turnoId: number) => {
    setSubmitting(true);
    setSubmitError(null);
    try {
      await iniciarTurno(turnoId, busEstado, observaciones);
    } catch (err: any) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && !driver) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-[calc(100vh-140px)]">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Cargando información del conductor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-12 h-[calc(100vh-140px)]">
        <div className="bg-rose-50 p-6 rounded-2xl border border-rose-200 text-center max-w-md">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-rose-800 font-bold text-lg mb-2">Error de Acceso</h3>
          <p className="text-rose-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (!driver) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Bienvenido, {driver.persona?.nombre || 'Conductor'}</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">Licencia: <span className="text-slate-700 font-bold">{driver.licencia}</span> ({driver.categoria_licencia})</p>
          </div>
        </div>
        <button 
          onClick={refreshData}
          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
          title="Actualizar turnos"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
        </button>
      </div>

      {activeShift ? (
        // UI when shift is active
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 shadow-xl text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
             <svg className="w-48 h-48" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
          </div>
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border-4 border-white/30 animate-pulse">
               <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
            </div>
            <div className="flex-1 text-center md:text-left">
              <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider mb-3 backdrop-blur-sm border border-white/30">
                Turno en Curso
              </span>
              <h2 className="text-3xl font-bold mb-2">GPS Activo y Transmitiendo</h2>
              <p className="text-emerald-50 text-lg opacity-90">
                Estás operando el bus con placa <strong className="text-white bg-black/20 px-2 py-0.5 rounded ml-1">{activeShift.bus?.placa}</strong>
              </p>
              <p className="text-emerald-100 text-sm mt-3">
                Hora de inicio: {activeShift.hora_inicio ? new Date(activeShift.hora_inicio).toLocaleTimeString() : ''}
              </p>
            </div>
            <div className="md:ml-auto mt-6 md:mt-0 flex flex-col items-center">
              <button 
                onClick={() => setIsIncidentModalOpen(true)}
                className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-2xl shadow-lg border border-rose-400/30 transition-all flex items-center gap-2"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                Reportar Incidente
              </button>
            </div>
          </div>
        </div>
      ) : scheduledShifts.length > 0 ? (
        // UI to start shift
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
               <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
               Turno Programado
            </h3>
            
            <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
               <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Bus Asignado</p>
               <p className="text-2xl font-bold text-slate-900">{scheduledShifts[0].bus?.placa || 'Desconocido'}</p>
               <div className="mt-3 flex items-center gap-3 text-sm text-slate-600 font-medium">
                  <span className="flex items-center gap-1"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg> {scheduledShifts[0].bus?.modelo || '-'}</span>
                  <span className="flex items-center gap-1"><svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/></svg> {scheduledShifts[0].bus?.capacidad_maxima ? `${scheduledShifts[0].bus.capacidad_maxima} pax` : '-'}</span>
               </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100">
               <p className="text-sm text-slate-500 mb-2">Por favor, inspecciona el vehículo antes de iniciar la ruta.</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
               <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
               Confirmar Estado
            </h3>

            {submitError && (
              <div className="p-3 mb-4 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-xl">
                {submitError}
              </div>
            )}

            <div className="space-y-4 mb-6">
              <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${busEstado === 'operativo' ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" name="estado" value="operativo" checked={busEstado === 'operativo'} onChange={() => setBusEstado('operativo')} className="hidden" />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${busEstado === 'operativo' ? 'border-indigo-500' : 'border-slate-300'}`}>
                   {busEstado === 'operativo' && <div className="w-3 h-3 bg-indigo-500 rounded-full"></div>}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">Operativo</h4>
                  <p className="text-xs text-slate-500 mt-0.5">El bus está en óptimas condiciones para la ruta.</p>
                </div>
              </label>

              <label className={`flex items-center p-4 border-2 rounded-2xl cursor-pointer transition-all ${busEstado === 'con_observaciones' ? 'border-amber-500 bg-amber-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" name="estado" value="con_observaciones" checked={busEstado === 'con_observaciones'} onChange={() => setBusEstado('con_observaciones')} className="hidden" />
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 ${busEstado === 'con_observaciones' ? 'border-amber-500' : 'border-slate-300'}`}>
                   {busEstado === 'con_observaciones' && <div className="w-3 h-3 bg-amber-500 rounded-full"></div>}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">Con Observaciones</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Requiere revisión o tiene defectos menores.</p>
                </div>
              </label>
            </div>

            {busEstado === 'con_observaciones' && (
              <div className="mb-6 animate-in slide-in-from-top-2 fade-in duration-200">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Observaciones</label>
                <textarea 
                  className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-amber-500 focus:ring-0 transition-colors"
                  rows={3}
                  placeholder="Ej. Faro derecho fundido, asientos manchados..."
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                ></textarea>
              </div>
            )}

            <button
              onClick={() => handleStartShift(scheduledShifts[0].turno_id as number)}
              disabled={submitting || (busEstado === 'con_observaciones' && observaciones.trim().length === 0)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
            >
              {submitting ? (
                 <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Iniciar Turno
                </>
              )}
            </button>
            <p className="text-center text-[10px] text-slate-400 mt-3 font-medium uppercase tracking-widest">
              Al iniciar el turno, se activará el seguimiento GPS
            </p>
          </div>
        </div>
      ) : (
        // No shifts scheduled
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center">
           <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
           </div>
           <h3 className="text-xl font-bold text-slate-800 mb-2">No tienes turnos programados</h3>
           <p className="text-slate-500 max-w-sm mx-auto">
             Actualmente no hay ningún turno asignado a tu perfil para el día de hoy. Contacta a tu supervisor si crees que es un error.
           </p>
        </div>
      )}

      {activeShift && (
        <ReportIncidentModal
          isOpen={isIncidentModalOpen}
          onClose={() => setIsIncidentModalOpen(false)}
          turnoId={activeShift.turno_id as number}
          onSuccess={() => {
            alert('Incidente reportado exitosamente.');
            setIsIncidentModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default DriverShiftPage;
