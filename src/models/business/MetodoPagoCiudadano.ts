import type { BaseBusinessEntity } from './BaseBusinessEntity';
import type { MetodoPago } from './MetodoPago';

export interface MetodoPagoCiudadano extends BaseBusinessEntity {
  metodo_pago_ciudadano_id?: number;
  metodo_pago_id?: number;
  ciudadano_id?: number;
  numero_instrumento?: string;
  es_principal?: boolean;
  saldo?: string;
  activo?: boolean;
  metodoPago?: MetodoPago;
}

export type CreateMetodoPagoCiudadanoDto = Omit<MetodoPagoCiudadano, 'id' | 'metodo_pago_ciudadano_id'>;
export type UpdateMetodoPagoCiudadanoDto = MetodoPagoCiudadano;
