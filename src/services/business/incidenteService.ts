import { ENDPOINTS } from '../../api/endpoints';
import type { Incidente, CreateIncidenteDto, UpdateIncidenteDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const incidenteService = createCrudService<Incidente, CreateIncidenteDto, UpdateIncidenteDto>(ENDPOINTS.BUSINESS.INCIDENTE);
export default incidenteService;
