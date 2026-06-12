import { ENDPOINTS } from '../../api/endpoints';
import type { Conductor, CreateConductorDto, UpdateConductorDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const conductorService = createCrudService<Conductor, CreateConductorDto, UpdateConductorDto>(ENDPOINTS.BUSINESS.CONDUCTOR);
export default conductorService;
