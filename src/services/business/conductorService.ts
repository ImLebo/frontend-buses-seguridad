import { ENDPOINTS } from '../../api/endpoints';
import type { Conductor, CreateConductorDto, UpdateConductorDto } from '../../models';
import { createCrudService } from './baseCrudService';

import { httpClient } from '../../api/httpClient';

const baseCrud = createCrudService<Conductor, CreateConductorDto, UpdateConductorDto>(ENDPOINTS.BUSINESS.CONDUCTOR);

export const conductorService = {
  ...baseCrud,
  getByEmail: (email: string) =>
    httpClient.get<Conductor>(`${ENDPOINTS.BUSINESS.CONDUCTOR}/email/${encodeURIComponent(email)}`),
};

export default conductorService;
