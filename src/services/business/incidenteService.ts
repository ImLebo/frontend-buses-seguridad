import { ENDPOINTS } from '../../api/endpoints';
import type { Incidente, CreateIncidenteDto, UpdateIncidenteDto } from '../../models';
import { createCrudService } from './baseCrudService';

import { httpClient } from '../../api/httpClient';

const baseCrud = createCrudService<Incidente, CreateIncidenteDto, UpdateIncidenteDto>(ENDPOINTS.BUSINESS.INCIDENTE);

export interface ReportarIncidentePayload {
  turnoId: number;
  tipo: string;
  gravedad: string;
  descripcion: string;
  fotos?: string[];
}

export const incidenteService = {
  ...baseCrud,
  reportarIncidente: (payload: ReportarIncidentePayload) =>
    httpClient.post<Incidente>(`${ENDPOINTS.BUSINESS.INCIDENTE}/reportar`, payload),
};

export default incidenteService;
