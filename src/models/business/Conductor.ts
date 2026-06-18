import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Conductor extends BaseBusinessEntity {
  conductor_id?: number;
  persona_id?: number;
  numero_licencia?: string;
  licencia?: string; // alias
  tipo_licencia?: string;
  categoria_licencia?: string; // alias
  estado?: string;
  persona?: any;
}

export type CreateConductorDto = Omit<Conductor, 'id' | 'conductor_id'>;
export type UpdateConductorDto = Conductor;
