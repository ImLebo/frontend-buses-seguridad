import { ENDPOINTS } from '../../api/endpoints';
import type { Historial, CreateHistorialDto, UpdateHistorialDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const historialService = createCrudService<Historial, CreateHistorialDto, UpdateHistorialDto>(ENDPOINTS.BUSINESS.HISTORIAL);
export default historialService;
