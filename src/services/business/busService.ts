import { httpClient } from '../../api/httpClient';
import { ENDPOINTS } from '../../api/endpoints';
import type { Bus, CreateBusDto, UpdateBusDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const busService = {
  ...createCrudService<Bus, CreateBusDto, UpdateBusDto>(ENDPOINTS.BUSINESS.BUS),
  findByEmpresa: (empresaId: string | number) =>
    httpClient.get<Bus[]>(`${ENDPOINTS.BUSINESS.BUS}/empresa/${empresaId}`),
};
export default busService;
