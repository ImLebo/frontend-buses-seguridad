import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Paradero extends BaseBusinessEntity {
  paradero_id?: number;
  nombre?: string;
  direccion?: string;
  latitud?: number;
  longitud?: number;
}

export type CreateParaderoDto = Omit<Paradero, 'id' | 'paradero_id'>;
export type UpdateParaderoDto = Paradero;
