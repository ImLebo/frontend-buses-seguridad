import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Empresa extends BaseBusinessEntity {
  empresa_id?: number;
  ruc?: string;
  razon_social?: string;
  direccion?: string;
  telefono?: string;
  estado?: string;
}

export type CreateEmpresaDto = Omit<Empresa, 'id' | 'empresa_id'>;
export type UpdateEmpresaDto = Empresa;
