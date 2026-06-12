import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Persona extends BaseBusinessEntity {
  persona_id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  telefono?: string;
  contrasena?: string;
  tipo?: string;
}

export type CreatePersonaDto = Omit<Persona, 'id' | 'persona_id'>;
export type UpdatePersonaDto = Persona;
