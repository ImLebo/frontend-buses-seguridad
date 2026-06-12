import { ENDPOINTS } from '../../api/endpoints';
import type { Ruta, CreateRutaDto, UpdateRutaDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const rutaService = createCrudService<Ruta, CreateRutaDto, UpdateRutaDto>(ENDPOINTS.BUSINESS.RUTA);
export default rutaService;
