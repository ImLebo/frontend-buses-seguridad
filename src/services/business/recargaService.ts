import { ENDPOINTS } from '../../api/endpoints';
import type { Recarga, CreateRecargaDto, UpdateRecargaDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const recargaService = createCrudService<Recarga, CreateRecargaDto, UpdateRecargaDto>(ENDPOINTS.BUSINESS.RECARGA);
export default recargaService;
