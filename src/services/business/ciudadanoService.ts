import { ENDPOINTS } from '../../api/endpoints';
import type { Ciudadano, CreateCiudadanoDto, UpdateCiudadanoDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const ciudadanoService = createCrudService<Ciudadano, CreateCiudadanoDto, UpdateCiudadanoDto>(ENDPOINTS.BUSINESS.CIUDADANO);
export default ciudadanoService;
