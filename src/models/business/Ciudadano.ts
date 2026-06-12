import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Ciudadano extends BaseBusinessEntity {
  ciudadano_id?: number;
  persona_id?: number;
  tipo_tarjeta?: string;
  saldo?: number;
  estado?: string;
}

export type CreateCiudadanoDto = Omit<Ciudadano, 'id' | 'ciudadano_id'>;
export type UpdateCiudadanoDto = Ciudadano;
