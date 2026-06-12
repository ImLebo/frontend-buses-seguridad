import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Grupo extends BaseBusinessEntity {
  grupo_id?: number;
  nombre?: string;
  descripcion?: string;
  estado?: string;
}

export type CreateGrupoDto = Omit<Grupo, 'id' | 'grupo_id'>;
export type UpdateGrupoDto = Grupo;
