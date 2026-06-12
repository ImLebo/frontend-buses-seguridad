import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Foto extends BaseBusinessEntity {
  foto_id?: number;
  url?: string;
  descripcion?: string;
  fecha_registro?: string;
}

export type CreateFotoDto = Omit<Foto, 'id' | 'foto_id'>;
export type UpdateFotoDto = Foto;
