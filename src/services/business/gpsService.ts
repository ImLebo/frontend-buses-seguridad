import { ENDPOINTS } from '../../api/endpoints';
import type { Gps, CreateGpsDto, UpdateGpsDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const gpsService = createCrudService<Gps, CreateGpsDto, UpdateGpsDto>(ENDPOINTS.BUSINESS.GPS);
export default gpsService;
