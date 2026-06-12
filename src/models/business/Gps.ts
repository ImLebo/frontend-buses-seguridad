import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Gps extends BaseBusinessEntity {
  gps_id?: number;
  bus_id?: number;
  latitud?: number;
  longitud?: number;
  velocidad?: number;
  fecha_hora?: string;
}

export type CreateGpsDto = Omit<Gps, 'id' | 'gps_id'>;
export type UpdateGpsDto = Gps;
