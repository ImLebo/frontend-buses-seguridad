import type { IncidenteBus, CreateIncidenteBusDto, UpdateIncidenteBusDto } from '../../models';
import { incidenteBusService } from '../../services/business/incidenteBusService';
import { useBusinessResource } from './useBusinessResource';

export const useIncidenteBus = () => useBusinessResource<IncidenteBus, CreateIncidenteBusDto, UpdateIncidenteBusDto>(incidenteBusService);
export default useIncidenteBus;
