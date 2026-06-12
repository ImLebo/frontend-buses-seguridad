import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface DesignatarioGrupo extends BaseBusinessEntity {
  designatario_grupo_id?: number;
  grupo_id?: number;
  nombre?: string;
  email?: string;
  telefono?: string;
}

export type CreateDesignatarioGrupoDto = Omit<DesignatarioGrupo, 'id' | 'designatario_grupo_id'>;
export type UpdateDesignatarioGrupoDto = DesignatarioGrupo;
