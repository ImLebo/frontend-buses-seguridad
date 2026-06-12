import { ENDPOINTS } from '../../api/endpoints';
import type { Nodo, CreateNodoDto, UpdateNodoDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const nodoService = createCrudService<Nodo, CreateNodoDto, UpdateNodoDto>(ENDPOINTS.BUSINESS.NODO);
export default nodoService;
