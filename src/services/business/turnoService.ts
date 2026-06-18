import { ENDPOINTS } from '../../api/endpoints';
import type { Turno, CreateTurnoDto, UpdateTurnoDto } from '../../models';
import { createCrudService } from './baseCrudService';

import { httpClient } from '../../api/httpClient';

const baseCrud = createCrudService<Turno, CreateTurnoDto, UpdateTurnoDto>(ENDPOINTS.BUSINESS.TURNO);

export const turnoService = {
  ...baseCrud,
  iniciarTurno: (id: number, payload: { busEstado: string; observaciones?: string }) =>
    httpClient.post<Turno>(`${ENDPOINTS.BUSINESS.TURNO}/${id}/iniciar`, payload),
};

export default turnoService;
