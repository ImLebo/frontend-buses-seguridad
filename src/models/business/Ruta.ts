import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Ruta extends BaseBusinessEntity {
  ruta_id?: number;
  codigo?: string;
  origen?: string;
  destino?: string;
  tarifa?: number;
}

export type CreateRutaDto = Omit<Ruta, 'id' | 'ruta_id'>;
export type UpdateRutaDto = Ruta;
