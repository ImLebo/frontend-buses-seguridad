import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface MetodoPagoCiudadano extends BaseBusinessEntity {
  metodo_pago_ciudadano_id?: number;
  metodo_pago_id?: number;
  ciudadano_id?: number;
  datos_tarjeta?: string;
}

export type CreateMetodoPagoCiudadanoDto = Omit<MetodoPagoCiudadano, 'id' | 'metodo_pago_ciudadano_id'>;
export type UpdateMetodoPagoCiudadanoDto = MetodoPagoCiudadano;
