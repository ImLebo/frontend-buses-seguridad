import type { Conductor, CreateConductorDto, UpdateConductorDto } from '../../models';
import { conductorService } from '../../services/business/conductorService';
import { useBusinessResource } from './useBusinessResource';

export const useConductor = () => useBusinessResource<Conductor, CreateConductorDto, UpdateConductorDto>(conductorService);
export default useConductor;
