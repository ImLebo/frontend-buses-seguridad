import { ENDPOINTS } from '../../api/endpoints';
import type { Mensaje, CreateMensajeDto, UpdateMensajeDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const mensajeService = createCrudService<Mensaje, CreateMensajeDto, UpdateMensajeDto>(ENDPOINTS.BUSINESS.MENSAJE);
export default mensajeService;
