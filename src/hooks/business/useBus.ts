import { useState, useCallback } from 'react';
import type { Bus, CreateBusDto, UpdateBusDto } from '../../models';
import { busService } from '../../services/business/busService';
import { useBusinessResource } from './useBusinessResource';

export const useBus = () => {
  const base = useBusinessResource<Bus, CreateBusDto, UpdateBusDto>(busService);
  const [busesByEmpresa, setBusesByEmpresa] = useState<Bus[]>([]);
  const [loadingEmpresa, setLoadingEmpresa] = useState(false);

  const fetchByEmpresa = useCallback(async (empresaId: string | number) => {
    setLoadingEmpresa(true);
    try {
      const result = await busService.findByEmpresa(empresaId);
      setBusesByEmpresa(result);
      return result;
    } finally {
      setLoadingEmpresa(false);
    }
  }, []);

  return {
    ...base,
    busesByEmpresa,
    loadingEmpresa,
    fetchByEmpresa,
  };
};
export default useBus;
