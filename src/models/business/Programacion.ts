import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Programacion extends BaseBusinessEntity {
  programacion_id?: number;
  ruta_id?: number;
  bus_id?: number;
  conductor_id?: number;
  hora_salida?: string;
  hora_llegada?: string;
}

export type CreateProgramacionDto = Omit<Programacion, 'id' | 'programacion_id'>;
export type UpdateProgramacionDto = Programacion;
