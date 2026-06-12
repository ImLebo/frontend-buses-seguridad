import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Incidente extends BaseBusinessEntity {
  incidente_id?: number;
  bus_id?: number;
  conductor_id?: number;
  tipo?: string;
  descripcion?: string;
  fecha_hora?: string;
  estado?: string;
}

export type CreateIncidenteDto = Omit<Incidente, 'id' | 'incidente_id'>;
export type UpdateIncidenteDto = Incidente;
