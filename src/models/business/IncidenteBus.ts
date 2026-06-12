import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface IncidenteBus extends BaseBusinessEntity {
  incidente_bus_id?: number;
  incidente_id?: number;
  bus_id?: number;
}

export type CreateIncidenteBusDto = Omit<IncidenteBus, 'id' | 'incidente_bus_id'>;
export type UpdateIncidenteBusDto = IncidenteBus;
