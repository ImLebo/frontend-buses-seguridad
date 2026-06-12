import { ENDPOINTS } from '../../api/endpoints';
import type { MetodoPagoCiudadano, CreateMetodoPagoCiudadanoDto, UpdateMetodoPagoCiudadanoDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const metodoPagoCiudadanoService = createCrudService<MetodoPagoCiudadano, CreateMetodoPagoCiudadanoDto, UpdateMetodoPagoCiudadanoDto>(ENDPOINTS.BUSINESS.METODO_PAGO_CIUDADANO);
export default metodoPagoCiudadanoService;
