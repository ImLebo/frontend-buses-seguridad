import type { BaseBusinessEntity } from './BaseBusinessEntity';
import type { Programacion } from './Programacion';
import type { MetodoPagoCiudadano } from './MetodoPagoCiudadano';

export interface Boleto extends BaseBusinessEntity {
  boleto_id?: number;
  ciudadano_id?: number;
  programacion_id?: number;
  metodo_pago_ciudadano_id?: number;
  costo?: string;
  estado?: string;
  inicio_viaje?: string;
  fin_viaje?: string;
  programacion?: Programacion;
  metodoPagoCiudadano?: MetodoPagoCiudadano;
}

export type CreateBoletoDto = Omit<Boleto, 'id' | 'boleto_id'>;
export type UpdateBoletoDto = Boleto;
