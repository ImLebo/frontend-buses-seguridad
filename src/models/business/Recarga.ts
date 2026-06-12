import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Recarga extends BaseBusinessEntity {
  recarga_id?: number;
  ciudadano_id?: number;
  monto?: number;
  fecha_hora?: string;
  metodo_pago?: string;
}

export type CreateRecargaDto = Omit<Recarga, 'id' | 'recarga_id'>;
export type UpdateRecargaDto = Recarga;
