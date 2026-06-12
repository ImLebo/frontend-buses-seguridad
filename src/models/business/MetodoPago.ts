import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface MetodoPago extends BaseBusinessEntity {
  metodo_pago_id?: number;
  nombre?: string;
  descripcion?: string;
  estado?: string;
}

export type CreateMetodoPagoDto = Omit<MetodoPago, 'id' | 'metodo_pago_id'>;
export type UpdateMetodoPagoDto = MetodoPago;
