import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Historial extends BaseBusinessEntity {
  historial_id?: number;
  usuario_id?: string;
  accion?: string;
  descripcion?: string;
  fecha_hora?: string;
}

export type CreateHistorialDto = Omit<Historial, 'id' | 'historial_id'>;
export type UpdateHistorialDto = Historial;
