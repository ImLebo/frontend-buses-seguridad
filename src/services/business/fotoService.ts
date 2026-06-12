import { ENDPOINTS } from '../../api/endpoints';
import type { Foto, CreateFotoDto, UpdateFotoDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const fotoService = createCrudService<Foto, CreateFotoDto, UpdateFotoDto>(ENDPOINTS.BUSINESS.FOTO);
export default fotoService;
