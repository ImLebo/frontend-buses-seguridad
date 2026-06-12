import { ENDPOINTS } from '../../api/endpoints';
import type { Paradero, CreateParaderoDto, UpdateParaderoDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const paraderoService = createCrudService<Paradero, CreateParaderoDto, UpdateParaderoDto>(ENDPOINTS.BUSINESS.PARADERO);
export default paraderoService;
