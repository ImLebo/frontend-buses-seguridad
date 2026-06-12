import type { Historial, CreateHistorialDto, UpdateHistorialDto } from '../../models';
import { historialService } from '../../services/business/historialService';
import { useBusinessResource } from './useBusinessResource';

export const useHistorial = () => useBusinessResource<Historial, CreateHistorialDto, UpdateHistorialDto>(historialService);
export default useHistorial;
