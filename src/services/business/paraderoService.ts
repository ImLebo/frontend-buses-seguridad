import { ENDPOINTS } from '../../api/endpoints';
import { httpClient } from '../../api/httpClient';
import type { Paradero, CreateParaderoDto, UpdateParaderoDto } from '../../models';
import { createCrudService } from './baseCrudService';

export interface ParaderoCercano {
  paradero: Paradero & {
    latitud: number | string;
    longitud: number | string;
    estado?: string;
  };
  distancia_m: number;
  rutas: {
    ruta_id: number;
    nombre: string;
  }[];
}

const baseCrud = createCrudService<Paradero, CreateParaderoDto, UpdateParaderoDto>(ENDPOINTS.BUSINESS.PARADERO);

export const paraderoService = {
  ...baseCrud,
  getCercanos: (lat: number, lng: number, radio?: number) =>
    httpClient.get<ParaderoCercano[]>(`${ENDPOINTS.BUSINESS.PARADERO}/cercanos`, {
      lat: lat.toString(),
      lng: lng.toString(),
      ...(radio ? { radio: radio.toString() } : {}),
    }),
};

export default paraderoService;
