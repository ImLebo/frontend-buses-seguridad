import { ENDPOINTS } from '../../api/endpoints';
import type { Turno, CreateTurnoDto, UpdateTurnoDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const turnoService = createCrudService<Turno, CreateTurnoDto, UpdateTurnoDto>(ENDPOINTS.BUSINESS.TURNO);
export default turnoService;
