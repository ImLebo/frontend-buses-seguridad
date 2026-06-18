import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminScheduleCreate } from '../hooks/business/useAdminScheduleCreate';

export const AdminScheduleCreatePage = () => {
  const navigate = useNavigate();
  const {
    rutas,
    buses,
    loadingInitialData,
    saveSchedule,
    isSaving,
    error,
    clearError
  } = useAdminScheduleCreate();

  const [rutaId, setRutaId] = useState('');
  const [busId, setBusId] = useState('');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const [horaFin, setHoraFin] = useState('');
  const [esRecurrente, setEsRecurrente] = useState(false);
  const [patronRecurrente, setPatronRecurrente] = useState('Diaria');
  const [tolerancia, setTolerancia] = useState('5');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rutaId || !busId || !fecha || !horaInicio) {
      alert('Por favor completa todos los campos requeridos.');
      return;
    }
    
    try {
      await saveSchedule({
        ruta_id: Number(rutaId),
        bus_id: Number(busId),
        fecha,
        hora_inicio: horaInicio + ':00', // Backend expects HH:mm:ss in some cases, or HH:mm is fine. Using standard format.
        hora_fin_estimada: horaFin ? horaFin + ':00' : undefined,
        es_recurrente: esRecurrente,
        patron_recurrente: patronRecurrente,
        margen_tolerancia_min: Number(tolerancia)
      });
      alert('¡Programación guardada exitosamente!');
      navigate('/app'); 
    } catch (err) {
      // Error handled by hook, displayed in UI
    }
  };

  if (loadingInitialData) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto gap-6 pb-12">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Programar Ruta</h1>
            <p className="text-slate-500 text-sm mt-1">Asigna un bus a una ruta en una fecha y horario específicos</p>
         </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-3">
              <div className="bg-rose-100 p-2 rounded-full">
                 <svg className="w-5 h-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="font-medium">{error}</span>
           </div>
           <button onClick={clearError} className="p-1.5 hover:bg-rose-100 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
      )}

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
         <div className="p-8">
           <form id="schedule-form" onSubmit={handleSave} className="space-y-8">
             
             {/* Sección: Relaciones Core */}
             <div>
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Información Operativa</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Ruta a operar *</label>
                      <select 
                        required
                        value={rutaId}
                        onChange={e => setRutaId(e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors bg-slate-50 font-medium"
                      >
                         <option value="" disabled>Seleccione una ruta...</option>
                         {rutas.map(r => (
                           <option key={r.ruta_id} value={r.ruta_id}>{r.codigo} - {r.nombre}</option>
                         ))}
                      </select>
                   </div>
                   
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Bus asignado *</label>
                      <select 
                        required
                        value={busId}
                        onChange={e => setBusId(e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors bg-slate-50 font-medium"
                      >
                         <option value="" disabled>Seleccione un bus...</option>
                         {buses.map(b => (
                           <option key={b.bus_id} value={b.bus_id}>[{b.placa}] - {b.marca} {b.modelo}</option>
                         ))}
                      </select>
                   </div>
                </div>
             </div>

             {/* Sección: Fechas y Tiempos */}
             <div>
                <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-2 mb-4">Horarios y Fechas</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Fecha de salida *</label>
                      <input 
                        required
                        type="date"
                        value={fecha}
                        onChange={e => setFecha(e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Hora de salida *</label>
                      <input 
                        required
                        type="time"
                        value={horaInicio}
                        onChange={e => setHoraInicio(e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                      />
                   </div>
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Hora de llegada estimada</label>
                      <input 
                        type="time"
                        value={horaFin}
                        onChange={e => setHoraFin(e.target.value)}
                        className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                      />
                      <span className="text-xs text-slate-400 mt-1 block">Opcional. Auto-calculado si se omite.</span>
                   </div>
                </div>
             </div>

             {/* Sección: Reglas Adicionales */}
             <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   
                   {/* Recurrencia */}
                   <div>
                      <label className="flex items-center gap-3 cursor-pointer mb-4">
                         <div className="relative">
                           <input 
                             type="checkbox" 
                             className="sr-only"
                             checked={esRecurrente}
                             onChange={e => setEsRecurrente(e.target.checked)}
                           />
                           <div className={`block w-12 h-7 rounded-full transition-colors ${esRecurrente ? 'bg-indigo-500' : 'bg-slate-300'}`}></div>
                           <div className={`absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${esRecurrente ? 'translate-x-5' : ''}`}></div>
                         </div>
                         <div className="font-bold text-slate-700 text-sm">¿Programación Recurrente?</div>
                      </label>

                      {esRecurrente && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                           <label className="block text-sm font-medium text-slate-600 mb-2">Patrón de repetición</label>
                           <select 
                             value={patronRecurrente}
                             onChange={e => setPatronRecurrente(e.target.value)}
                             className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-0 transition-colors bg-white"
                           >
                              <option value="Diaria">Diaria (Lunes a Domingo)</option>
                              <option value="Lunes a Viernes">Lunes a Viernes</option>
                              <option value="Fines de semana">Fines de semana</option>
                           </select>
                        </div>
                      )}
                   </div>

                   {/* Tolerancia */}
                   <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Margen de tolerancia (minutos)</label>
                      <div className="flex items-center gap-3">
                         <input 
                           required
                           type="number"
                           min="0"
                           max="60"
                           value={tolerancia}
                           onChange={e => setTolerancia(e.target.value)}
                           className="w-24 border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-0 transition-colors text-center font-bold"
                         />
                         <span className="text-sm text-slate-500">minutos de gracia al salir</span>
                      </div>
                   </div>

                </div>
             </div>

           </form>
         </div>

         <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
            <button 
              type="submit" 
              form="schedule-form"
              disabled={isSaving}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-3.5 px-8 rounded-xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                  Guardar Programación
                </>
              )}
            </button>
         </div>
      </div>
    </div>
  );
};

export default AdminScheduleCreatePage;
