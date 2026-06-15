import { ENDPOINTS } from '../../api/endpoints';
import { httpClient } from '../../api/httpClient';
import type { Ciudadano, CreateCiudadanoDto, UpdateCiudadanoDto } from '../../models';
import { createCrudService } from './baseCrudService';

const baseCrud = createCrudService<Ciudadano, CreateCiudadanoDto, UpdateCiudadanoDto>(ENDPOINTS.BUSINESS.CIUDADANO);

export const ciudadanoService = {
  ...baseCrud,
  getByEmail: (email: string) =>
    httpClient.get<Ciudadano>(`${ENDPOINTS.BUSINESS.CIUDADANO}/email/${encodeURIComponent(email)}`),
};

export default ciudadanoService;
