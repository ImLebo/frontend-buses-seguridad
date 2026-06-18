import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { recargaService } from '../services/business/recargaService';

export const EpaycoMockCheckoutPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const ref = searchParams.get('ref');
  const amount = searchParams.get('amount');
  const desc = searchParams.get('desc');
  const email = searchParams.get('email');

  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    // If accessed without params, simulate error or redirect
    if (!ref || !amount) {
      setStatus('error');
    }
  }, [ref, amount]);

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ref) return;

    try {
      setIsProcessing(true);
      // Simular delay de red
      await new Promise(r => setTimeout(r, 2000));
      
      // Llamar a nuestro backend simulando ser el webhook de ePayco
      await recargaService.confirmarWebhookSimulado(ref, 'Aceptada');
      
      setStatus('success');
      
      // Auto-redirigir de vuelta
      setTimeout(() => {
        navigate('/app?payment=success');
      }, 3000);
      
    } catch (err) {
      setStatus('error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
         <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">¡Pago Aprobado!</h1>
            <p className="text-slate-500 mb-8">Transacción completada con ePayco. Serás redirigido a la aplicación...</p>
            <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
         </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
         <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 text-center">
            <div className="w-20 h-20 bg-rose-100 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
            </div>
            <h1 className="text-2xl font-bold text-slate-800 mb-2">Error en el Pago</h1>
            <p className="text-slate-500 mb-8">Hubo un problema procesando la transacción o los datos son inválidos.</p>
            <button onClick={() => navigate('/app')} className="text-indigo-600 font-bold hover:underline">Volver al Comercio</button>
         </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col items-center py-12 px-4 font-sans">
      
      {/* Mock ePayco Header */}
      <div className="w-full max-w-lg mb-6 flex justify-center">
         <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/30">
               <span className="text-white font-bold text-xl">e</span>
            </div>
            <span className="text-2xl font-black text-slate-800 tracking-tight">Payco <span className="text-orange-500">Checkout</span></span>
         </div>
      </div>

      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
         
         {/* Order Summary */}
         <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
               <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.64-2.25 1.64-1.74 0-2.1-.96-2.15-1.71H8.04c.05 1.86 1.27 2.65 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/></svg>
            </div>
            <div className="relative z-10">
               <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Comercio: Sistema de Transporte</p>
               <h2 className="text-4xl font-black mb-2">${Number(amount).toLocaleString()} <span className="text-xl text-slate-400 font-normal">COP</span></h2>
               <p className="text-slate-300 text-sm">{desc}</p>
               <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between text-xs">
                  <span className="text-slate-400">Ref: {ref}</span>
                  <span className="text-slate-400">{email}</span>
               </div>
            </div>
         </div>

         {/* Payment Form */}
         <div className="p-8">
            <form onSubmit={handlePay}>
               
               <h3 className="font-bold text-slate-800 mb-4">Medio de Pago</h3>
               
               <div className="grid grid-cols-3 gap-3 mb-8">
                  <button type="button" onClick={() => setPaymentMethod('card')} className={`border-2 rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                     <span className="text-xs font-bold">Tarjeta</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('pse')} className={`border-2 rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'pse' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" /></svg>
                     <span className="text-xs font-bold">PSE</span>
                  </button>
                  <button type="button" onClick={() => setPaymentMethod('cash')} className={`border-2 rounded-xl p-3 flex flex-col items-center gap-2 transition-all ${paymentMethod === 'cash' ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                     <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                     <span className="text-xs font-bold">Efectivo</span>
                  </button>
               </div>

               {paymentMethod === 'card' && (
                 <div className="space-y-4 mb-8 animate-in fade-in slide-in-from-bottom-2">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Número de Tarjeta</label>
                       <input type="text" placeholder="4111 1111 1111 1111" required className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-orange-500 focus:ring-0 transition-colors font-mono" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vencimiento</label>
                          <input type="text" placeholder="MM/YY" required className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-orange-500 focus:ring-0 transition-colors font-mono" />
                       </div>
                       <div>
                          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">CVC</label>
                          <input type="text" placeholder="123" required className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-orange-500 focus:ring-0 transition-colors font-mono" />
                       </div>
                    </div>
                 </div>
               )}
               
               {paymentMethod === 'pse' && (
                 <div className="space-y-4 mb-8 animate-in fade-in slide-in-from-bottom-2">
                    <div>
                       <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Banco</label>
                       <select required className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-orange-500 focus:ring-0 transition-colors">
                          <option>Bancolombia</option>
                          <option>Davivienda</option>
                          <option>Banco de Bogotá</option>
                          <option>Nequi / Daviplata</option>
                       </select>
                    </div>
                 </div>
               )}

               <button 
                 type="submit" 
                 disabled={isProcessing}
                 className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-black uppercase tracking-wider py-4 rounded-xl shadow-lg shadow-orange-500/30 transition-all flex items-center justify-center gap-2"
               >
                 {isProcessing ? (
                   <>
                     <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                     Procesando...
                   </>
                 ) : (
                   `Pagar $${Number(amount).toLocaleString()}`
                 )}
               </button>
               
               <div className="mt-6 flex items-center justify-center gap-2 text-slate-400 text-xs font-medium">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                  Pagos seguros procesados por ePayco
               </div>

            </form>
         </div>
      </div>
    </div>
  );
};

export default EpaycoMockCheckoutPage;
