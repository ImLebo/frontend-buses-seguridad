import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Conductor extends BaseBusinessEntity {
  conductor_id?: number;
  persona_id?: number;
  numero_licencia?: string;
  tipo_licencia?: string;
  estado?: string;
}

export type CreateConductorDto = Omit<Conductor, 'id' | 'conductor_id'>;
export type UpdateConductorDto = Conductor;
