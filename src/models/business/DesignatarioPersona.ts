import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface DesignatarioPersona extends BaseBusinessEntity {
  designatario_persona_id?: number;
  persona_id?: number;
  nombre?: string;
  email?: string;
  telefono?: string;
}

export type CreateDesignatarioPersonaDto = Omit<DesignatarioPersona, 'id' | 'designatario_persona_id'>;
export type UpdateDesignatarioPersonaDto = DesignatarioPersona;
