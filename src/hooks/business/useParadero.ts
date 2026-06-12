import type { Paradero, CreateParaderoDto, UpdateParaderoDto } from '../../models';
import { paraderoService } from '../../services/business/paraderoService';
import { useBusinessResource } from './useBusinessResource';

export const useParadero = () => useBusinessResource<Paradero, CreateParaderoDto, UpdateParaderoDto>(paraderoService);
export default useParadero;
