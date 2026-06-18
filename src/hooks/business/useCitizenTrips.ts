import { useState, useEffect, useCallback } from 'react';
import { useCurrentUserInfo } from '../useCurrentUserInfo';
import { ciudadanoService } from '../../services/business/ciudadanoService';
import { boletoService, type RecorridoInfo } from '../../services/business/boletoService';
import type { Boleto, Ciudadano } from '../../models';

export const useCitizenTrips = () => {
  const { currentUserInfo, loading: userLoading } = useCurrentUserInfo();
  
  const [citizen, setCitizen] = useState<Ciudadano | null>(null);
  const [trips, setTrips] = useState<Boleto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Detalle del recorrido seleccionado
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [recorridoLoading, setRecorridoLoading] = useState(false);
  const [recorridoInfo, setRecorridoInfo] = useState<RecorridoInfo | null>(null);
  const [recorridoError, setRecorridoError] = useState<string | null>(null);

  const loadCitizenData = useCallback(async (email: string) => {
    try {
      const citizenData = await ciudadanoService.getByEmail(email);
      setCitizen(citizenData);
      return citizenData;
    } catch (err) {
      console.error('[useCitizenTrips] Error loading citizen info:', err);
      throw new Error('No se pudo asociar tu cuenta con un registro de ciudadano.');
    }
  }, []);

  const loadTripsHistory = useCallback(async (citizenId: number) => {
    try {
      const tickets = await boletoService.getAll();
      const completedTrips = tickets
        .filter((t) => t.ciudadano_id === citizenId && t.estado === 'completado')
        .sort((a, b) => {
          const dateA = a.fin_viaje ? new Date(a.fin_viaje).getTime() : 0;
          const dateB = b.fin_viaje ? new Date(b.fin_viaje).getTime() : 0;
          return dateB - dateA; // Orden descendente (más recientes primero)
        });
      setTrips(completedTrips);
    } catch (err) {
      console.error('[useCitizenTrips] Error loading trips:', err);
      throw new Error('Error al obtener el historial de viajes.');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!currentUserInfo?.email) return;
      
      setLoading(true);
      setError(null);
      try {
        const citizenData = await loadCitizenData(currentUserInfo.email);
        if (citizenData?.ciudadano_id) {
          await loadTripsHistory(citizenData.ciudadano_id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [currentUserInfo, loadCitizenData, loadTripsHistory]);

  const loadRecorrido = useCallback(async (boletoId: number) => {
    setRecorridoLoading(true);
    setRecorridoError(null);
    setSelectedTripId(boletoId);
    setRecorridoInfo(null);
    try {
      const info = await boletoService.recorrido(boletoId);
      setRecorridoInfo(info);
    } catch (err: any) {
      console.error('[useCitizenTrips] Error loading recorrido:', err);
      setRecorridoError('Error al cargar los detalles del recorrido.');
    } finally {
      setRecorridoLoading(false);
    }
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedTripId(null);
    setRecorridoInfo(null);
    setRecorridoError(null);
  }, []);

  return {
    citizen,
    trips,
    loading: loading || userLoading,
    error,
    selectedTripId,
    recorridoInfo,
    recorridoLoading,
    recorridoError,
    loadRecorrido,
    clearSelection
  };
};

export default useCitizenTrips;
