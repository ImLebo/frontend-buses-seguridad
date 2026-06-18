import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Turno extends BaseBusinessEntity {
  turno_id?: number;
  conductor_id?: number;
  bus_id?: number;
  fecha?: string;
  hora_inicio?: string;
  hora_fin?: string;
  estado?: string;
  bus?: any;
}

export type CreateTurnoDto = Omit<Turno, 'id' | 'turno_id'>;
export type UpdateTurnoDto = Turno;
