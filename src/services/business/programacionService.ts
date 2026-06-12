import { ENDPOINTS } from '../../api/endpoints';
import type { Programacion, CreateProgramacionDto, UpdateProgramacionDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const programacionService = createCrudService<Programacion, CreateProgramacionDto, UpdateProgramacionDto>(ENDPOINTS.BUSINESS.PROGRAMACION);
export default programacionService;
