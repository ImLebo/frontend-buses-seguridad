import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { busService } from '../services/business/busService';
import { useCurrentUserInfo } from '../hooks/useCurrentUserInfo';

export const CompanyBusCreatePage = () => {
  const navigate = useNavigate();
  const { currentUserInfo } = useCurrentUserInfo();

  const [placa, setPlaca] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [anioFabricacion, setAnioFabricacion] = useState(new Date().getFullYear().toString());
  
  const [capacidadMaxima, setCapacidadMaxima] = useState('');
  const [capacidadSentados, setCapacidadSentados] = useState('');
  const [capacidadParados, setCapacidadParados] = useState('');
  
  const [estado, setEstado] = useState('operativo');
  const [fotoBase64, setFotoBase64] = useState<string>('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUserInfo?.empresaId) {
      setError('Error de sesión: No tienes una empresa asociada para registrar el bus.');
      return;
    }
    
    // UI Validation
    const cMax = parseInt(capacidadMaxima);
    const cSen = parseInt(capacidadSentados || '0');
    const cPar = parseInt(capacidadParados || '0');
    
    if (cSen + cPar > cMax) {
      setError('La suma de capacidad de sentados y parados no puede exceder la capacidad máxima declarada.');
      return;
    }
    
    try {
      setIsSaving(true);
      setError(null);
      
      await busService.create({
        empresa_id: currentUserInfo.empresaId,
        placa: placa.toUpperCase(),
        marca,
        modelo,
        anio_fabricacion: parseInt(anioFabricacion),
        capacidad_maxima: cMax,
        capacidad_sentados: cSen || undefined,
        capacidad_parados: cPar || undefined,
        estado,
        foto_base64: fotoBase64 || undefined
      });
      
      alert('¡Bus registrado exitosamente en tu flota!');
      navigate('/app'); 
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al registrar el bus';
      setError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col max-w-5xl mx-auto gap-6 pb-12">
      <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl font-bold text-slate-900">Registrar Nuevo Bus</h1>
            <p className="text-slate-500 text-sm mt-1">Añade una nueva unidad a la flota de tu empresa</p>
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
           <button onClick={() => setError(null)} className="p-1.5 hover:bg-rose-100 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* Left Column: Form Info */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Vehiculo Info */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5">Identificación del Vehículo</h3>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Placa Única *</label>
                     <input 
                       required
                       type="text"
                       placeholder="Ej. XYZ-999"
                       value={placa}
                       onChange={e => setPlaca(e.target.value.toUpperCase())}
                       className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors uppercase font-mono font-bold tracking-widest text-indigo-900"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Año de Fabricación *</label>
                     <input 
                       required
                       type="number"
                       min="1990"
                       max={new Date().getFullYear()}
                       value={anioFabricacion}
                       onChange={e => setAnioFabricacion(e.target.value)}
                       className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Marca</label>
                     <input 
                       type="text"
                       placeholder="Ej. Volvo"
                       value={marca}
                       onChange={e => setMarca(e.target.value)}
                       className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Modelo</label>
                     <input 
                       type="text"
                       placeholder="Ej. B11R"
                       value={modelo}
                       onChange={e => setModelo(e.target.value)}
                       className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                     />
                  </div>
               </div>
            </div>

            {/* Capacidades */}
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-5">Capacidad Operativa</h3>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Total Máximo *</label>
                     <div className="relative">
                        <input 
                          required
                          type="number"
                          min="1"
                          value={capacidadMaxima}
                          onChange={e => setCapacidadMaxima(e.target.value)}
                          className="w-full border-2 border-indigo-200 bg-indigo-50 rounded-xl p-3.5 pl-12 text-sm font-bold focus:border-indigo-500 focus:ring-0 transition-colors"
                        />
                        <svg className="w-5 h-5 text-indigo-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Sentados</label>
                     <input 
                       type="number"
                       min="0"
                       value={capacidadSentados}
                       onChange={e => setCapacidadSentados(e.target.value)}
                       className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                     />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2">Parados</label>
                     <input 
                       type="number"
                       min="0"
                       value={capacidadParados}
                       onChange={e => setCapacidadParados(e.target.value)}
                       className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors"
                     />
                  </div>
               </div>
            </div>

         </div>

         {/* Right Column: Status & Photo */}
         <div className="space-y-6">
            
            {/* Estado */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
               <h3 className="text-sm font-bold text-slate-800 mb-4">Estado Inicial</h3>
               <select 
                  value={estado}
                  onChange={e => setEstado(e.target.value)}
                  className="w-full border-2 border-slate-200 rounded-xl p-3.5 text-sm focus:border-indigo-500 focus:ring-0 transition-colors font-medium"
               >
                  <option value="operativo">🟢 Operativo</option>
                  <option value="mantenimiento">🟡 Mantenimiento</option>
                  <option value="fuera de servicio">🔴 Fuera de Servicio</option>
               </select>
            </div>

            {/* Fotografía */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 text-center">
               <h3 className="text-sm font-bold text-slate-800 mb-4">Fotografía de la Unidad</h3>
               
               <div className="relative w-full aspect-video rounded-2xl border-2 border-dashed border-slate-300 overflow-hidden group hover:border-indigo-500 transition-colors bg-slate-50 flex items-center justify-center">
                  {fotoBase64 ? (
                     <img src={fotoBase64} alt="Bus preview" className="w-full h-full object-cover" />
                  ) : (
                     <div className="text-slate-400 flex flex-col items-center">
                        <svg className="w-10 h-10 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        <span className="text-xs font-bold uppercase tracking-wider">Subir Foto</span>
                     </div>
                  )}
                  <input 
                     type="file" 
                     accept="image/*"
                     onChange={handleImageChange}
                     className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
               </div>
               <p className="text-xs text-slate-400 mt-3">Formatos: JPG, PNG (Max 5MB)</p>
            </div>

            {/* Save Button */}
            <div className="pt-2">
               <button 
                 type="submit" 
                 disabled={isSaving}
                 className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 text-lg"
               >
                 {isSaving ? (
                   <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                 ) : (
                   <>
                     Guardar Bus en Flota
                   </>
                 )}
               </button>
            </div>

         </div>

      </form>
    </div>
  );
};

export default CompanyBusCreatePage;
