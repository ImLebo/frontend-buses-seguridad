import React, { useState, useRef } from 'react';
import { incidenteService } from '../../services/business/incidenteService';

interface ReportIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  turnoId: number;
  onSuccess: () => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({ isOpen, onClose, turnoId, onSuccess }) => {
  const [tipo, setTipo] = useState('mecánico');
  const [gravedad, setGravedad] = useState('bajo');
  const [descripcion, setDescripcion] = useState('');
  const [fotosBase64, setFotosBase64] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (fotosBase64.length + files.length > 5) {
      alert('Solo puedes subir un máximo de 5 fotos.');
      return;
    }

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotosBase64(prev => {
           if (prev.length < 5) return [...prev, reader.result as string];
           return prev;
        });
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const removePhoto = (index: number) => {
    setFotosBase64(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion.trim()) {
      setError('La descripción es obligatoria.');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await incidenteService.reportarIncidente({
        turnoId,
        tipo,
        gravedad,
        descripcion,
        fotos: fotosBase64
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al reportar el incidente');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
             </div>
             <div>
                <h3 className="text-lg font-bold text-slate-900">Reportar Incidente</h3>
                <p className="text-xs text-rose-600 font-medium">Notificación inmediata al supervisor</p>
             </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
           {error && (
             <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
               {error}
             </div>
           )}

           <form id="incident-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Tipo de Incidente</label>
                    <select 
                       value={tipo}
                       onChange={(e) => setTipo(e.target.value)}
                       className="w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm focus:border-rose-500 focus:ring-0 transition-colors bg-white font-medium"
                    >
                       <option value="mecánico">Falla Mecánica</option>
                       <option value="accidente">Accidente de Tránsito</option>
                       <option value="retraso">Retraso Operativo</option>
                       <option value="pasajero">Problema con Pasajero</option>
                       <option value="otro">Otro</option>
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Gravedad</label>
                    <select 
                       value={gravedad}
                       onChange={(e) => setGravedad(e.target.value)}
                       className="w-full border-2 border-slate-200 rounded-xl p-2.5 text-sm focus:border-rose-500 focus:ring-0 transition-colors bg-white font-medium"
                    >
                       <option value="bajo">Bajo (Sin impacto)</option>
                       <option value="medio">Medio (Impacto leve)</option>
                       <option value="alto">Alto (Requiere asistencia)</option>
                       <option value="critico">Crítico (Emergencia)</option>
                    </select>
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Descripción de los hechos</label>
                 <textarea 
                   required
                   rows={4}
                   value={descripcion}
                   onChange={(e) => setDescripcion(e.target.value)}
                   placeholder="Describe qué ocurrió, si hay heridos, daños visibles..."
                   className="w-full border-2 border-slate-200 rounded-xl p-3 text-sm focus:border-rose-500 focus:ring-0 transition-colors"
                 />
              </div>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Evidencia Fotográfica (Max 5)</label>
                 
                 <div className="grid grid-cols-5 gap-2 mb-2">
                    {fotosBase64.map((b64, idx) => (
                       <div key={idx} className="aspect-square relative rounded-lg overflow-hidden border border-slate-200 group bg-slate-50">
                          <img src={b64} alt="Evidencia" className="w-full h-full object-cover" />
                          <button 
                             type="button" 
                             onClick={() => removePhoto(idx)}
                             className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-600"
                          >
                             <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                       </div>
                    ))}
                    {fotosBase64.length < 5 && (
                       <button 
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-rose-400 hover:text-rose-500 transition-colors bg-slate-50 hover:bg-rose-50"
                       >
                          <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          <span className="text-[10px] font-bold">Agregar</span>
                       </button>
                    )}
                 </div>
                 
                 <input 
                   type="file" 
                   accept="image/*" 
                   multiple 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   className="hidden" 
                 />
                 <p className="text-[10px] text-slate-500">Se adjuntarán las coordenadas GPS automáticamente al enviar.</p>
              </div>
           </form>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 rounded-b-3xl">
           <button 
             type="button" 
             onClick={onClose}
             disabled={submitting}
             className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors disabled:opacity-50"
           >
              Cancelar
           </button>
           <button 
             type="submit" 
             form="incident-form"
             disabled={submitting || !descripcion.trim()}
             className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-200 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center gap-2"
           >
              {submitting && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
              {submitting ? 'Enviando...' : 'Enviar Reporte'}
           </button>
        </div>
      </div>
    </div>
  );
};
