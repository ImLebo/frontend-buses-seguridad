import { ENDPOINTS } from '../../api/endpoints';
import type { Direccion, CreateDireccionDto, UpdateDireccionDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const direccionService = createCrudService<Direccion, CreateDireccionDto, UpdateDireccionDto>(ENDPOINTS.BUSINESS.DIRECCION);
export default direccionService;
