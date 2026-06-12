import type { Incidente, CreateIncidenteDto, UpdateIncidenteDto } from '../../models';
import { incidenteService } from '../../services/business/incidenteService';
import { useBusinessResource } from './useBusinessResource';

export const useIncidente = () => useBusinessResource<Incidente, CreateIncidenteDto, UpdateIncidenteDto>(incidenteService);
export default useIncidente;
