import { ENDPOINTS } from '../../api/endpoints';
import { httpClient } from '../../api/httpClient';
import type { Ruta, CreateRutaDto, UpdateRutaDto, RutaDisponible } from '../../models';
import { createCrudService } from './baseCrudService';

const baseCrud = createCrudService<Ruta, CreateRutaDto, UpdateRutaDto>(ENDPOINTS.BUSINESS.RUTA);

export const rutaService = {
  ...baseCrud,
  getDisponibles: (nombre?: string) =>
    httpClient.get<RutaDisponible[]>(`${ENDPOINTS.BUSINESS.RUTA}/disponibles`, nombre ? { nombre } : undefined),
};

export default rutaService;
