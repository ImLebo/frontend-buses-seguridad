import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Nodo extends BaseBusinessEntity {
  nodo_id?: number;
  nombre?: string;
  latitud?: number;
  longitud?: number;
  tipo?: string;
}

export type CreateNodoDto = Omit<Nodo, 'id' | 'nodo_id'>;
export type UpdateNodoDto = Nodo;
