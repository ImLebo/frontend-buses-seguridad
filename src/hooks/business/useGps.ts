import type { Gps, CreateGpsDto, UpdateGpsDto } from '../../models';
import { gpsService } from '../../services/business/gpsService';
import { useBusinessResource } from './useBusinessResource';

export const useGps = () => useBusinessResource<Gps, CreateGpsDto, UpdateGpsDto>(gpsService);
export default useGps;
