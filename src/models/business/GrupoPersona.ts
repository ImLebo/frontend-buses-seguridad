import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface GrupoPersona extends BaseBusinessEntity {
  grupo_persona_id?: number;
  grupo_id?: number;
  persona_id?: number;
  cargo?: string;
}

export type CreateGrupoPersonaDto = Omit<GrupoPersona, 'id' | 'grupo_persona_id'>;
export type UpdateGrupoPersonaDto = GrupoPersona;
