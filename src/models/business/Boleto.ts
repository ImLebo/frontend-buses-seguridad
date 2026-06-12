import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Boleto extends BaseBusinessEntity {
  boleto_id?: number;
  ciudadano_id?: number;
  programacion_id?: number;
  fecha_compra?: string;
  monto?: number;
  estado?: string;
}

export type CreateBoletoDto = Omit<Boleto, 'id' | 'boleto_id'>;
export type UpdateBoletoDto = Boleto;
