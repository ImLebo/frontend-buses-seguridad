import { useState, useEffect } from 'react';
import { useBoletoAbordar } from '../hooks/business/useBoletoAbordar';

export const CitizenBoardingPage = () => {
  const {
    citizen,
    programmings,
    nearbyStops,
    activeTicket,
    loading,
    gpsLoading,
    error: apiError,
    abordar,
    descender,
    refresh
  } = useBoletoAbordar();

  const [selectedProgId, setSelectedProgId] = useState<number | null>(null);
  const [selectedMetodoId, setSelectedMetodoId] = useState<number | null>(null);
  const [selectedStopId, setSelectedStopId] = useState<number | null>(null);
  const [selectedDescensoStopId, setSelectedDescensoStopId] = useState<number | null>(null);

  const [actionError, setActionError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Auto-select nearest stop if available and not selected yet
  useEffect(() => {
    if (nearbyStops.length > 0 && !selectedStopId) {
      setSelectedStopId(nearbyStops[0].paradero.paradero_id || null);
    }
  }, [nearbyStops, selectedStopId]);

  // Auto-select default payment method (principal)
  useEffect(() => {
    if (citizen?.metodosPago && citizen.metodosPago.length > 0 && !selectedMetodoId) {
      const principal = citizen.metodosPago.find(m => m.es_principal && m.activo);
      const firstActive = citizen.metodosPago.find(m => m.activo);
      setSelectedMetodoId((principal || firstActive)?.metodo_pago_ciudadano_id || null);
    }
  }, [citizen, selectedMetodoId]);

  // Find currently selected programming details
  const selectedProg = programmings.find(p => p.programacion_id === selectedProgId);
  const tariff = selectedProg?.ruta?.tarifa ? Number(selectedProg.ruta.tarifa) : 0;

  // Find selected payment method details
  const selectedMetodo = citizen?.metodosPago?.find(m => m.metodo_pago_ciudadano_id === selectedMetodoId);
  const balance = selectedMetodo?.saldo ? parseFloat(selectedMetodo.saldo) : 0;
  const hasSufficientBalance = balance >= tariff;

  const handleAbordar = async () => {
    if (!selectedProgId || !selectedMetodoId || !selectedStopId) {
      setActionError('Por favor selecciona todos los campos requeridos.');
      return;
    }

    if (!hasSufficientBalance) {
      setActionError('Saldo insuficiente en el método de pago seleccionado.');
      return;
    }

    setActionError(null);
    setSuccessMsg(null);
    try {
      const result = await abordar(selectedProgId, selectedMetodoId, selectedStopId);
      setSuccessMsg(result.mensaje || '¡Abordaje registrado exitosamente!');
      setSelectedProgId(null);
    } catch (err: any) {
      setActionError(err.message || 'Error al validar el abordaje.');
    }
  };

  const handleDescender = async () => {
    if (!selectedDescensoStopId) {
      setActionError('Por favor selecciona el paradero de descenso.');
      return;
    }

    setActionError(null);
    setSuccessMsg(null);
    try {
      const result = await descender(selectedDescensoStopId);
      setSuccessMsg(result.mensaje || '¡Descenso registrado exitosamente! Buen viaje.');
      setSelectedDescensoStopId(null);
    } catch (err: any) {
      setActionError(err.message || 'Error al registrar descenso.');
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto py-2">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Abordar Autobús</h2>
        <p className="text-sm text-slate-600">
          Valida tu método de pago para abordar un bus, comprar tu boleto y registrar el trayecto.
        </p>
      </div>

      {/* Messages */}
      {apiError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm shadow-sm flex items-start gap-2.5">
          <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="font-bold">Error de servicio</p>
            <p className="text-xs text-rose-600 mt-0.5">{apiError}</p>
          </div>
        </div>
      )}

      {actionError && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-sm shadow-sm flex items-start gap-2.5">
          <svg className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-bold">Acción denegada</p>
            <p className="text-xs text-rose-600 mt-0.5">{actionError}</p>
          </div>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm shadow-sm flex items-start gap-2.5">
          <svg className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-bold">Transacción Exitosa</p>
            <p className="text-xs text-emerald-600 mt-0.5">{successMsg}</p>
          </div>
        </div>
      )}

      {loading && !activeTicket ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white border border-slate-100 rounded-3xl shadow-sm">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-500 mt-4 font-semibold">Procesando información del servicio...</p>
        </div>
      ) : activeTicket ? (
        /* ==================== SCREEN: ACTIVE TICKET ==================== */
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Digital Boarding Ticket (Left) */}
          <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-lg relative">
            {/* Ticket Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white text-center relative">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wide border border-emerald-500/30 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Viaje en Curso
              </span>
              <h3 className="text-xl font-black tracking-tight">BOLETO ELECTRÓNICO</h3>
              <p className="text-[10px] opacity-75 mt-1 font-mono uppercase">ID Boleto: #{activeTicket.boleto_id}</p>
              
              {/* Ticket cutouts on the sides */}
              <div className="absolute left-0 bottom-0 w-4 h-8 bg-slate-50 rounded-r-full translate-x-[-8px] translate-y-[4px]"></div>
              <div className="absolute right-0 bottom-0 w-4 h-8 bg-slate-50 rounded-l-full translate-x-[8px] translate-y-[4px]"></div>
            </div>

            {/* Ticket Details */}
            <div className="p-6 border-b border-dashed border-slate-200 relative">
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-sm">
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ruta</p>
                  <p className="font-bold text-slate-800 text-base">{activeTicket.programacion?.ruta?.nombre || 'Ruta No Identificada'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Autobús</p>
                  <p className="font-bold text-slate-800 text-base">{activeTicket.programacion?.bus?.placa || 'Desconocido'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Hora de Abordaje</p>
                  <p className="font-medium text-slate-700">
                    {activeTicket.inicio_viaje ? new Date(activeTicket.inicio_viaje).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tarifa pagada</p>
                  <p className="font-bold text-indigo-600 text-base">${activeTicket.costo || '0.00'}</p>
                </div>
              </div>

              {/* Ticket cutouts on the sides */}
              <div className="absolute left-0 bottom-0 w-4 h-8 bg-slate-50 rounded-r-full translate-x-[-8px] translate-y-[16px]"></div>
              <div className="absolute right-0 bottom-0 w-4 h-8 bg-slate-50 rounded-l-full translate-x-[8px] translate-y-[16px]"></div>
            </div>

            {/* Mock QR Code Section */}
            <div className="p-6 bg-slate-50/50 flex flex-col items-center justify-center text-center">
              <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col items-center justify-center mb-3">
                {/* Visual SVG QR mock */}
                <svg className="w-32 h-32 text-slate-900" viewBox="0 0 100 100" fill="currentColor">
                  {/* Outer boundaries */}
                  <rect x="5" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="11" y="11" width="13" height="13" />
                  <rect x="70" y="5" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="76" y="11" width="13" height="13" />
                  <rect x="5" y="70" width="25" height="25" fill="none" stroke="currentColor" strokeWidth="6" />
                  <rect x="11" y="76" width="13" height="13" />
                  {/* QR details dots */}
                  <rect x="40" y="5" width="10" height="10" />
                  <rect x="40" y="25" width="5" height="5" />
                  <rect x="50" y="15" width="10" height="5" />
                  <rect x="40" y="40" width="15" height="15" />
                  <rect x="15" y="45" width="10" height="10" />
                  <rect x="70" y="45" width="15" height="10" />
                  <rect x="60" y="60" width="10" height="15" />
                  <rect x="40" y="70" width="15" height="15" />
                  <rect x="80" y="75" width="15" height="10" />
                  <circle cx="85" cy="85" r="3" />
                  <circle cx="50" cy="50" r="4" />
                </svg>
                <span className="text-[9px] text-slate-400 font-mono mt-2 uppercase tracking-widest">CÓDIGO DE TRÁNSITO ACTIVO</span>
              </div>
              <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                Muestra este código al inspector del autobús o lector de salida en caso de ser requerido.
              </p>
            </div>
          </div>

          {/* Descenso Action Form (Right) */}
          <div className="md:col-span-5 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
            <div>
              <h4 className="font-bold text-slate-800 text-lg">Registrar Salida</h4>
              <p className="text-xs text-slate-500 mt-1">
                Al llegar a tu destino, selecciona el paradero correspondiente para registrar tu descenso y finalizar el viaje.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Paradero de Descenso</label>
              {gpsLoading ? (
                <p className="text-xs text-slate-400 italic">Buscando paraderos cercanos con GPS...</p>
              ) : nearbyStops.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {nearbyStops.map((ns) => (
                    <label
                      key={ns.paradero.paradero_id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                        selectedDescensoStopId === ns.paradero.paradero_id
                          ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500/20'
                          : 'border-slate-100 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <input
                        type="radio"
                        name="descensoStop"
                        value={ns.paradero.paradero_id}
                        checked={selectedDescensoStopId === ns.paradero.paradero_id}
                        onChange={() => setSelectedDescensoStopId(ns.paradero.paradero_id || null)}
                        className="mt-1 text-indigo-600 focus:ring-indigo-500"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900">{ns.paradero.nombre}</p>
                        <p className="text-[10px] text-slate-400">{ns.paradero.direccion}</p>
                        <span className="inline-block mt-1 text-[9px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded">
                          A {ns.distancia_m} m (GPS)
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 p-3 rounded-xl">
                  No se detectan paraderos cercanos mediante geolocalización. Activa el GPS del navegador.
                </p>
              )}
            </div>

            <button
              onClick={handleDescender}
              disabled={loading || !selectedDescensoStopId}
              className="w-full py-3 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-bold rounded-2xl shadow-sm transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Registrando descenso...
                </>
              ) : (
                'Finalizar Viaje (Descenso)'
              )}
            </button>

            <button
              onClick={refresh}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold text-center mt-1"
            >
              Recargar ubicación y datos
            </button>
          </div>
        </div>
      ) : (
        /* ==================== SCREEN: BOARDING WIZARD ==================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Wizard Form (Left) */}
          <div className="lg:col-span-8 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-6">
            {/* Step 1: Boarding Stop */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-widest">
                  Paso 1: Paradero de Abordaje
                </span>
                {gpsLoading && <span className="text-[10px] text-slate-400 animate-pulse">Actualizando GPS...</span>}
              </div>
              
              {nearbyStops.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {nearbyStops.slice(0, 4).map((ns, idx) => {
                    const isSelected = selectedStopId === ns.paradero.paradero_id;
                    return (
                      <div
                        key={ns.paradero.paradero_id}
                        onClick={() => setSelectedStopId(ns.paradero.paradero_id || null)}
                        className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col gap-1.5 ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500/10'
                            : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-1">{ns.paradero.nombre}</h4>
                          <span className="text-[9px] font-bold px-1.5 py-0.5 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-100 whitespace-nowrap">
                            {ns.distancia_m} m
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 line-clamp-1">{ns.paradero.direccion}</p>
                        {idx === 0 && (
                          <span className="self-start text-[8px] font-bold px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded uppercase">
                            Más cercano (Auto-seleccionado)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 bg-amber-50 border border-amber-100 text-amber-800 rounded-2xl text-xs flex items-center gap-2">
                  <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>
                    No se han detectado paraderos cercanos con el GPS. Se utilizará la geolocalización por defecto en caso de continuar.
                  </span>
                </div>
              )}
            </div>

            <hr className="border-slate-100" />

            {/* Step 2: Programming Selection */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                Paso 2: Autobús a Abordar
              </span>
              
              <div className="flex flex-col gap-2">
                {programmings.length > 0 ? (
                  <div className="flex flex-col gap-2.5">
                    {programmings.map((prog) => {
                      // Obtener aforo
                      // En una app real, el aforo se calcularía con un contador de boletos activos.
                      // Simulamos u obtenemos la cantidad desde el modelo de ser necesario.
                      // Como la entidad NestJS retorna relaciones, podemos contar prog.boletos.
                      const boletosActivos = prog.boletos ? prog.boletos.filter((b) => b.estado === 'activo').length : 0;
                      const capMax = prog.bus?.capacidad_maxima || 40;
                      const isFull = boletosActivos >= capMax;
                      const isSelected = selectedProgId === prog.programacion_id;

                      return (
                        <div
                          key={prog.programacion_id}
                          onClick={() => !isFull && setSelectedProgId(prog.programacion_id || null)}
                          className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                            isFull
                              ? 'border-slate-100 bg-slate-50/50 opacity-60 cursor-not-allowed'
                              : isSelected
                              ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500/10 cursor-pointer'
                              : 'border-slate-100 hover:border-slate-300 bg-white cursor-pointer'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isFull ? 'bg-slate-200 text-slate-400' : isSelected ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                              </svg>
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 text-sm leading-tight">
                                {prog.ruta?.nombre || 'Ruta'}
                              </h4>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Placa: <span className="font-semibold text-slate-700">{prog.bus?.placa}</span> | Tarifa: <span className="font-bold text-slate-800">${prog.ruta?.tarifa || '0.00'}</span>
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3 self-start md:self-auto">
                            <div className="text-right">
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Aforo</p>
                              <p className={`text-xs font-bold ${isFull ? 'text-rose-600' : boletosActivos > capMax * 0.8 ? 'text-amber-600' : 'text-emerald-600'}`}>
                                {boletosActivos} / {capMax} pasajeros
                              </p>
                            </div>
                            {isFull ? (
                              <span className="px-2.5 py-1 text-[10px] bg-rose-50 border border-rose-200 text-rose-800 font-bold rounded-lg uppercase">
                                Lleno
                              </span>
                            ) : isSelected ? (
                              <div className="w-5 h-5 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm">
                                ✓
                              </div>
                            ) : null}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-8 bg-slate-50 border border-slate-100 text-center rounded-2xl flex flex-col items-center justify-center gap-2">
                    <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-slate-700 font-bold text-sm">No hay viajes en curso en este momento</p>
                    <p className="text-slate-400 text-xs max-w-xs">
                      Los conductores deben iniciar su turno y marcar sus viajes como "en curso" para que aparezcan en esta lista.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Step 3: Payment Method */}
            <div className="flex flex-col gap-3">
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
                Paso 3: Método de Pago
              </span>

              {citizen?.metodosPago && citizen.metodosPago.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {citizen.metodosPago.filter(m => m.activo).map((m) => {
                    const isSelected = selectedMetodoId === m.metodo_pago_ciudadano_id;
                    const cardBalance = m.saldo ? parseFloat(m.saldo) : 0;
                    const isBalanceSufficient = cardBalance >= tariff || !selectedProgId;

                    return (
                      <div
                        key={m.metodo_pago_ciudadano_id}
                        onClick={() => setSelectedMetodoId(m.metodo_pago_ciudadano_id || null)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex flex-col gap-2 ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50/40 ring-1 ring-indigo-500/10'
                            : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50/30'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <svg className="w-5 h-5 text-slate-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <h4 className="font-bold text-slate-900 text-xs">
                              {m.metodoPago?.nombre || 'Tarjeta Prepago'}
                            </h4>
                          </div>
                          {m.es_principal && (
                            <span className="text-[8px] bg-indigo-100 text-indigo-700 font-bold px-1 py-0.5 rounded uppercase">
                              Principal
                            </span>
                          )}
                        </div>

                        <p className="text-[10px] text-slate-400 font-mono">Instrumento: {m.numero_instrumento || '**** **** **** ****'}</p>
                        
                        <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-slate-100/50">
                          <span className="text-[10px] text-slate-400 font-medium">Saldo disponible:</span>
                          <span className={`text-xs font-bold ${isBalanceSufficient ? 'text-slate-800' : 'text-rose-600 font-black animate-pulse'}`}>
                            ${m.saldo || '0.00'}
                          </span>
                        </div>
                        {!isBalanceSufficient && (
                          <p className="text-[9px] text-rose-500 font-bold mt-1">
                            Saldo insuficiente (Tarifa: ${tariff.toFixed(2)})
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 bg-slate-50 border border-slate-100 text-center rounded-2xl flex flex-col items-center justify-center gap-1.5">
                  <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <p className="text-slate-700 font-bold text-xs">No tienes métodos de pago registrados</p>
                  <p className="text-slate-400 text-[10px] max-w-xs">
                    Por favor, añade una tarjeta de transporte prepago o método de pago en tu perfil antes de abordar.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Checkout/Summary Sidebar (Right) */}
          <div className="lg:col-span-4 bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col gap-5 relative">
            <div>
              <h4 className="font-bold text-slate-800 text-lg">Resumen de Abordaje</h4>
              <p className="text-xs text-slate-500 mt-1">Verifica los detalles antes de registrar tu viaje.</p>
            </div>

            <div className="flex flex-col gap-3 text-xs border-y border-slate-100 py-4">
              <div className="flex justify-between gap-2">
                <span className="text-slate-400 font-medium">Parada de Abordaje:</span>
                <span className="font-bold text-slate-700 text-right">
                  {nearbyStops.find(n => n.paradero.paradero_id === selectedStopId)?.paradero.nombre || 'No Seleccionada'}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-400 font-medium">Ruta / Autobús:</span>
                <span className="font-bold text-slate-700 text-right">
                  {selectedProg ? `${selectedProg.ruta?.nombre} (Bus: ${selectedProg.bus?.placa})` : 'No Seleccionado'}
                </span>
              </div>
              <div className="flex justify-between gap-2">
                <span className="text-slate-400 font-medium">Método de Pago:</span>
                <span className="font-bold text-slate-700 text-right">
                  {selectedMetodo ? `${selectedMetodo.metodoPago?.nombre || 'Prepago'} (Saldo: $${selectedMetodo.saldo})` : 'No Seleccionado'}
                </span>
              </div>
              <div className="flex justify-between gap-2 mt-2 pt-2 border-t border-dashed border-slate-100">
                <span className="text-slate-600 font-bold text-sm">Tarifa del Viaje:</span>
                <span className="font-extrabold text-indigo-600 text-sm">${tariff.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleAbordar}
              disabled={loading || !selectedProgId || !selectedMetodoId || !selectedStopId || !hasSufficientBalance}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Validando Abordaje...
                </>
              ) : (
                'Confirmar Abordaje'
              )}
            </button>

            <button
              onClick={refresh}
              className="text-xs text-slate-500 hover:text-indigo-600 font-semibold text-center"
            >
              Actualizar datos de red
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CitizenBoardingPage;
