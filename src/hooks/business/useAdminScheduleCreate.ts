import { useState, useEffect } from 'react';
import { rutaService } from '../../services/business/rutaService';
import { busService } from '../../services/business/busService';
import { programacionService } from '../../services/business/programacionService';
import type { Ruta, Bus } from '../../models';

export const useAdminScheduleCreate = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loadingInitialData, setLoadingInitialData] = useState(true);
  
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoadingInitialData(true);
      const [rutasRes, busesRes] = await Promise.all([
        rutaService.getAll(),
        busService.getAll()
      ]);
      setRutas(rutasRes);
      setBuses(busesRes);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar la lista de rutas o buses disponibles.');
    } finally {
      setLoadingInitialData(false);
    }
  };

  const saveSchedule = async (data: {
    ruta_id: number;
    bus_id: number;
    fecha: string;
    hora_inicio: string;
    hora_fin_estimada?: string;
    es_recurrente: boolean;
    patron_recurrente?: string;
    margen_tolerancia_min: number;
  }) => {
    try {
      setIsSaving(true);
      setError(null);
      
      const payload: any = { ...data };
      if (!data.es_recurrente) {
         payload.patron_recurrente = undefined;
      }
      if (!data.hora_fin_estimada) {
         payload.hora_fin_estimada = undefined;
      }

      const res = await programacionService.create(payload);
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al guardar la programación';
      setError(msg);
      throw err;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    rutas,
    buses,
    loadingInitialData,
    saveSchedule,
    isSaving,
    error,
    clearError: () => setError(null)
  };
};
