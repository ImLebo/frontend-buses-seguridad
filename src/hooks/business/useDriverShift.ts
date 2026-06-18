import { useState, useEffect, useCallback } from 'react';
import { useCurrentUserInfo } from '../useCurrentUserInfo';
import { conductorService } from '../../services/business/conductorService';
import { turnoService } from '../../services/business/turnoService';
import type { Conductor, Turno } from '../../models';

export const useDriverShift = () => {
  const { currentUserInfo, loading: userLoading } = useCurrentUserInfo();
  
  const [driver, setDriver] = useState<Conductor | null>(null);
  const [scheduledShifts, setScheduledShifts] = useState<Turno[]>([]);
  const [activeShift, setActiveShift] = useState<Turno | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDriverData = useCallback(async (email: string) => {
    try {
      const driverData = await conductorService.getByEmail(email);
      setDriver(driverData);
      return driverData;
    } catch (err) {
      console.error('[useDriverShift] Error loading driver info:', err);
      throw new Error('No se pudo asociar tu cuenta con un registro de conductor.');
    }
  }, []);

  const loadShifts = useCallback(async (driverId: number) => {
    try {
      const shifts = await turnoService.getAll();
      
      const driverShifts = shifts.filter((t) => t.conductor_id === driverId);
      
      const scheduled = driverShifts
        .filter((t) => t.estado === 'programado')
        .sort((a, b) => {
          const dateA = a.hora_inicio ? new Date(a.hora_inicio).getTime() : 0;
          const dateB = b.hora_inicio ? new Date(b.hora_inicio).getTime() : 0;
          return dateA - dateB; 
        });
        
      const active = driverShifts.find((t) => t.estado === 'en_curso');

      setScheduledShifts(scheduled);
      setActiveShift(active || null);
    } catch (err) {
      console.error('[useDriverShift] Error loading shifts:', err);
      throw new Error('Error al obtener los turnos programados.');
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!currentUserInfo?.email) return;
      
      setLoading(true);
      setError(null);
      try {
        const driverData = await loadDriverData(currentUserInfo.email);
        if (driverData?.conductor_id) {
          await loadShifts(driverData.conductor_id);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    void init();
  }, [currentUserInfo, loadDriverData, loadShifts]);

  const iniciarTurno = async (turnoId: number, busEstado: string, observaciones?: string) => {
    setLoading(true);
    setError(null);
    try {
      await turnoService.iniciarTurno(turnoId, { busEstado, observaciones });
      if (driver?.conductor_id) {
        await loadShifts(driver.conductor_id);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al iniciar el turno';
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    if (!driver?.conductor_id) return;
    setLoading(true);
    try {
      await loadShifts(driver.conductor_id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    driver,
    scheduledShifts,
    activeShift,
    loading: loading || userLoading,
    error,
    iniciarTurno,
    refreshData
  };
};

export default useDriverShift;
