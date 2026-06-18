import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCitizenRecharge } from '../hooks/business/useCitizenRecharge';

export const CitizenRechargePage = () => {
  const navigate = useNavigate();
  const { citizen, loading, error, initiateRecharge, refresh } = useCitizenRecharge();

  const [selectedMetodoId, setSelectedMetodoId] = useState<number | null>(null);
  const [amountInput, setAmountInput] = useState<string>('');
  
  // Opciones rápidas
  const quickAmounts = [10000, 20000, 50000, 100000];

  useEffect(() => {
    if (citizen?.metodosPago && citizen.metodosPago.length > 0 && !selectedMetodoId) {
      const principal = citizen.metodosPago.find(m => m.es_principal && m.activo);
      const firstActive = citizen.metodosPago.find(m => m.activo);
      setSelectedMetodoId((principal || firstActive)?.metodo_pago_ciudadano_id || null);
    }
  }, [citizen, selectedMetodoId]);

  const selectedMetodo = citizen?.metodosPago?.find(m => m.metodo_pago_ciudadano_id === selectedMetodoId);
  const currentBalance = selectedMetodo?.saldo ? parseFloat(selectedMetodo.saldo) : 0;
  
  const amountToRecharge = parseFloat(amountInput || '0');
  const epaycoCommission = amountToRecharge > 0 ? (amountToRecharge * 0.0299 + 900) : 0; // 2.99% + 900 COP approx
  const totalToPay = amountToRecharge + epaycoCommission;
  const newBalance = currentBalance + amountToRecharge;

  const handleRecharge = async () => {
    if (!selectedMetodoId) return;
    if (amountToRecharge < 5000 || amountToRecharge > 500000) {
      alert('El monto debe estar entre $5,000 y $500,000');
      return;
    }

    try {
      const result = await initiateRecharge(selectedMetodoId, amountToRecharge);
      // Redirigir al simulador de ePayco
      navigate(`/epayco-checkout?ref=${encodeURIComponent(result.referencia)}&amount=${encodeURIComponent(totalToPay.toString())}&desc=${encodeURIComponent(result.descripcion)}&email=${encodeURIComponent(result.email || '')}`);
    } catch (err) {
      // error is handled by the hook
    }
  };

  if (loading && !citizen) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-w-4xl mx-auto gap-8 pb-12">
      
      {/* Header */}
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Recargar Saldo</h1>
            <p className="text-slate-500 text-sm mt-1">Añade saldo a tu tarjeta de transporte usando ePayco</p>
         </div>
         <button onClick={refresh} className="text-indigo-600 p-2 hover:bg-indigo-50 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
         </button>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-sm flex items-center justify-between shadow-sm">
           <span className="font-medium">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
         
         {/* Configuración de Recarga (Izquierda) */}
         <div className="md:col-span-7 flex flex-col gap-6">
            
            {/* Selección de Tarjeta */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">1. Tarjeta a Recargar</h3>
               
               {citizen?.metodosPago && citizen.metodosPago.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                     {citizen.metodosPago.filter(m => m.activo).map((m) => (
                        <div 
                           key={m.metodo_pago_ciudadano_id}
                           onClick={() => setSelectedMetodoId(m.metodo_pago_ciudadano_id || null)}
                           className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                              selectedMetodoId === m.metodo_pago_ciudadano_id 
                              ? 'border-indigo-500 bg-indigo-50/50' 
                              : 'border-slate-100 hover:border-slate-200 bg-white'
                           }`}
                        >
                           <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedMetodoId === m.metodo_pago_ciudadano_id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                              </div>
                              <div>
                                 <h4 className="font-bold text-slate-900 text-sm">{m.metodoPago?.nombre || 'Tarjeta Principal'}</h4>
                                 <p className="text-xs text-slate-500 font-mono mt-0.5">{m.numero_instrumento || '**** **** **** ****'}</p>
                              </div>
                           </div>
                           <div className="text-right">
                              <p className="text-[10px] text-slate-400 font-bold uppercase">Saldo Actual</p>
                              <p className="font-bold text-slate-800">${m.saldo || '0.00'}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               ) : (
                  <div className="p-4 bg-amber-50 text-amber-700 rounded-xl text-sm border border-amber-200">
                     No tienes tarjetas registradas activas para recargar.
                  </div>
               )}
            </div>

            {/* Monto */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
               <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-4">2. Monto de Recarga</h3>
               
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                  {quickAmounts.map(qa => (
                     <button
                        key={qa}
                        onClick={() => setAmountInput(qa.toString())}
                        className={`py-3 rounded-xl border-2 font-bold transition-all text-sm ${
                           amountInput === qa.toString()
                           ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                           : 'border-slate-100 text-slate-600 hover:border-slate-200 hover:bg-slate-50'
                        }`}
                     >
                        ${qa.toLocaleString()}
                     </button>
                  ))}
               </div>

               <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Otro Monto (COP)</label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                     <input 
                        type="number"
                        min="5000"
                        max="500000"
                        value={amountInput}
                        onChange={e => setAmountInput(e.target.value)}
                        placeholder="Ej. 35000"
                        className="w-full border-2 border-slate-200 rounded-xl p-4 pl-8 text-lg font-bold text-slate-800 focus:border-indigo-500 focus:ring-0 transition-colors"
                     />
                  </div>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium">Mínimo: $5,000 | Máximo: $500,000</p>
               </div>
            </div>

         </div>

         {/* Resumen (Derecha) */}
         <div className="md:col-span-5 relative">
            <div className="sticky top-6 bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-indigo-100/20">
               
               <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 mx-auto mb-4">
                     <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <h3 className="font-black text-2xl text-slate-800">Resumen</h3>
               </div>

               <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500">Saldo Actual</span>
                     <span className="font-bold text-slate-700">${currentBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                     <span className="text-slate-500">A Recargar</span>
                     <span className="font-bold text-indigo-600">+ ${amountToRecharge.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-slate-100">
                     <div className="flex justify-between items-center text-xs mb-1">
                        <span className="text-slate-400">Comisión ePayco</span>
                        <span className="font-medium text-slate-500">${epaycoCommission.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                     </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                     <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-slate-800">Total a Pagar</span>
                        <span className="font-black text-xl text-slate-900">${totalToPay.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                     </div>
                  </div>
               </div>

               <div className="bg-emerald-50 rounded-2xl p-4 mb-6 border border-emerald-100">
                  <p className="text-xs text-emerald-800 text-center font-medium">
                     Tu saldo después de la recarga será de <br/>
                     <span className="font-black text-lg text-emerald-600">${newBalance.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                  </p>
               </div>

               <button 
                  onClick={handleRecharge}
                  disabled={loading || !selectedMetodoId || amountToRecharge < 5000 || amountToRecharge > 500000}
                  className="w-full bg-slate-900 hover:bg-black disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
               >
                  {loading ? (
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                     <>
                        Continuar al Pago
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                     </>
                  )}
               </button>

               <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                  <svg className="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.1-.96-2.15-1.71H8.04c.05 1.86 1.27 2.65 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/></svg>
                  Pagos seguros por ePayco
               </div>

            </div>
         </div>

      </div>
    </div>
  );
};

export default CitizenRechargePage;
