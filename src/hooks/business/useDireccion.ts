import type { Direccion, CreateDireccionDto, UpdateDireccionDto } from '../../models';
import { direccionService } from '../../services/business/direccionService';
import { useBusinessResource } from './useBusinessResource';

export const useDireccion = () => useBusinessResource<Direccion, CreateDireccionDto, UpdateDireccionDto>(direccionService);
export default useDireccion;
