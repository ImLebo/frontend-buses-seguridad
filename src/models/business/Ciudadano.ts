import type { BaseBusinessEntity } from './BaseBusinessEntity';
import type { MetodoPagoCiudadano } from './MetodoPagoCiudadano';
import type { Boleto } from './Boleto';

export interface Ciudadano extends BaseBusinessEntity {
  ciudadano_id?: number;
  persona_id?: number;
  tipo_tarjeta?: string;
  saldo?: number;
  estado?: string;
  metodosPago?: MetodoPagoCiudadano[];
  boletos?: Boleto[];
}

export type CreateCiudadanoDto = Omit<Ciudadano, 'id' | 'ciudadano_id'>;
export type UpdateCiudadanoDto = Ciudadano;
