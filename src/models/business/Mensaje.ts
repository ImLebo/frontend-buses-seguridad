import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Mensaje extends BaseBusinessEntity {
  mensaje_id?: number;
  emisor_id?: number;
  receptor_id?: number;
  contenido?: string;
  fecha_envio?: string;
  leido?: boolean;
}

export type CreateMensajeDto = Omit<Mensaje, 'id' | 'mensaje_id'>;
export type UpdateMensajeDto = Mensaje;
