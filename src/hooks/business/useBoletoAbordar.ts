import { useState, useEffect, useCallback } from 'react';
import { useCurrentUserInfo } from '../useCurrentUserInfo';
import { ciudadanoService } from '../../services/business/ciudadanoService';
import { programacionService } from '../../services/business/programacionService';
import { paraderoService, type ParaderoCercano } from '../../services/business/paraderoService';
import { boletoService } from '../../services/business/boletoService';
import type { Ciudadano, Programacion, Boleto } from '../../models';

export const useBoletoAbordar = () => {
  const { currentUserInfo, loading: userLoading } = useCurrentUserInfo();
  
  const [citizen, setCitizen] = useState<Ciudadano | null>(null);
  const [programmings, setProgrammings] = useState<Programacion[]>([]);
  const [nearbyStops, setNearbyStops] = useState<ParaderoCercano[]>([]);
  const [activeTicket, setActiveTicket] = useState<Boleto | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);

  // 1. Fetch Citizen details (using email from current session)
  const loadCitizenData = useCallback(async (email: string) => {
    try {
      const citizenData = await ciudadanoService.getByEmail(email);
      setCitizen(citizenData);
      return citizenData;
    } catch (err) {
      console.error('[useBoletoAbordar] Error loading citizen info:', err);
      throw new Error('No se pudo asociar tu cuenta con un registro de ciudadano.');
    }
  }, []);

  // 2. Fetch Active schedules (en_curso)
  const loadActiveSchedules = useCallback(async () => {
    try {
      const allSchedules = await programacionService.getAll();
      // Filtrar únicamente los viajes en curso
      const active = allSchedules.filter((p) => p.estado === 'en_curso');
      setProgrammings(active);
    } catch (err) {
      console.error('[useBoletoAbordar] Error loading schedules:', err);
    }
  }, []);

  // 3. Fetch Nearby Stops using Geolocation
  const loadNearbyStops = useCallback(async () => {
    if (!navigator.geolocation) return;
    setGpsLoading(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude: lat, longitude: lng } = position.coords;
          const stops = await paraderoService.getCercanos(lat, lng, 1000); // 1km radius
          setNearbyStops(stops);
        } catch (err) {
          console.error('[useBoletoAbordar] Error loading nearby stops:', err);
        } finally {
          setGpsLoading(false);
        }
      },
      (err) => {
        console.warn('[useBoletoAbordar] Geolocation failed:', err.message);
        setGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // 4. Fetch Active Ticket (if any)
  const checkActiveTicket = useCallback(async (citizenId: number) => {
    try {
      const tickets = await boletoService.getAll();
      const active = tickets.find(
        (t) => t.ciudadano_id === citizenId && t.estado === 'activo'
      );
      setActiveTicket(active || null);
    } catch (err) {
      console.error('[useBoletoAbordar] Error checking active ticket:', err);
    }
  }, []);

  // Load initial data
  useEffect(() => {
    const init = async () => {
      if (!currentUserInfo?.email) return;
      
      setLoading(true);
      setError(null);
      try {
        const citizenData = await loadCitizenData(currentUserInfo.email);
        if (citizenData?.ciudadano_id) {
          await Promise.all([
            loadActiveSchedules(),
            loadNearbyStops(),
            checkActiveTicket(citizenData.ciudadano_id),
          ]);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [currentUserInfo, loadCitizenData, loadActiveSchedules, loadNearbyStops, checkActiveTicket]);

  // Actions
  const abordar = async (
    programacionId: number,
    metodoPagoCiudadanoId: number,
    paraderoAbordajeId: number
  ) => {
    if (!citizen?.ciudadano_id) throw new Error('Información de ciudadano no disponible.');

    setLoading(true);
    setError(null);
    try {
      const result = await boletoService.abordar({
        ciudadanoId: citizen.ciudadano_id,
        programacionId,
        metodoPagoCiudadanoId,
        paraderoAbordajeId,
      });

      // Recargar datos tras el abordaje
      await checkActiveTicket(citizen.ciudadano_id);
      
      // Actualizar el saldo localmente
      setCitizen((prev) => {
        if (!prev) return null;
        return {
          ...prev,
          metodosPago: (prev.metodosPago || []).map((m) => {
            if (m.metodo_pago_ciudadano_id === metodoPagoCiudadanoId) {
              return { ...m, saldo: result.saldoRestante };
            }
            return m;
          }),
        };
      });

      return result;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al validar el abordaje';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const descender = async (paraderoDescensoId: number) => {
    if (!activeTicket?.boleto_id || !citizen?.ciudadano_id) {
      throw new Error('No hay boleto activo para registrar el descenso.');
    }

    setLoading(true);
    setError(null);
    try {
      const result = await boletoService.descender(activeTicket.boleto_id, {
        paraderoDescensoId,
      });
      
      // Limpiar el boleto activo
      setActiveTicket(null);
      return result;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al registrar descenso';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (!citizen?.ciudadano_id) return;
    setLoading(true);
    try {
      await Promise.all([
        loadActiveSchedules(),
        loadNearbyStops(),
        checkActiveTicket(citizen.ciudadano_id),
      ]);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    citizen,
    programmings,
    nearbyStops,
    activeTicket,
    loading: loading || userLoading,
    gpsLoading,
    error,
    abordar,
    descender,
    refresh: refreshData,
  };
};

export default useBoletoAbordar;
