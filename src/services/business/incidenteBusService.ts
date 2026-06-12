import { ENDPOINTS } from '../../api/endpoints';
import type { IncidenteBus, CreateIncidenteBusDto, UpdateIncidenteBusDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const incidenteBusService = createCrudService<IncidenteBus, CreateIncidenteBusDto, UpdateIncidenteBusDto>(ENDPOINTS.BUSINESS.INCIDENTE_BUS);
export default incidenteBusService;
