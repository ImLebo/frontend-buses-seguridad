import { ENDPOINTS } from '../../api/endpoints';
import type { MetodoPago, CreateMetodoPagoDto, UpdateMetodoPagoDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const metodoPagoService = createCrudService<MetodoPago, CreateMetodoPagoDto, UpdateMetodoPagoDto>(ENDPOINTS.BUSINESS.METODO_PAGO);
export default metodoPagoService;
