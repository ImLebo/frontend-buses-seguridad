import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Direccion extends BaseBusinessEntity {
  direccion_id?: number;
  calle?: string;
  numero?: string;
  distrito?: string;
  provincia?: string;
  departamento?: string;
  referencia?: string;
}

export type CreateDireccionDto = Omit<Direccion, 'id' | 'direccion_id'>;
export type UpdateDireccionDto = Direccion;
