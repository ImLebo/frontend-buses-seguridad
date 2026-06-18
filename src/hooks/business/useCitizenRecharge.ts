import { useState, useEffect } from 'react';
import { useCurrentUserInfo } from '../useCurrentUserInfo';
import { ciudadanoService } from '../../services/business/ciudadanoService';
import { recargaService } from '../../services/business/recargaService';
import type { Ciudadano } from '../../models';

export const useCitizenRecharge = () => {
  const { currentUserInfo } = useCurrentUserInfo();
  const [citizen, setCitizen] = useState<Ciudadano | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCitizenData = async () => {
    if (!currentUserInfo?.email) return;
    try {
      setLoading(true);
      setError(null);
      const res = await ciudadanoService.getByEmail(currentUserInfo.email);
      setCitizen(res);
    } catch (err: any) {
      console.error(err);
      setError('Error al cargar la información del ciudadano.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCitizenData();
  }, [currentUserInfo]);

  const initiateRecharge = async (metodoId: number, monto: number) => {
    try {
      setLoading(true);
      setError(null);
      const res = await recargaService.iniciar({
        metodo_pago_ciudadano_id: metodoId,
        monto
      });
      return res;
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Error al iniciar recarga';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    citizen,
    loading,
    error,
    initiateRecharge,
    refresh: fetchCitizenData
  };
};
