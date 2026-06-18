import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Bus extends BaseBusinessEntity {
  bus_id?: number;
  empresa_id?: number;
  placa?: string;
  codigo_qr?: string;
  modelo?: string;
  marca?: string;
  anio_fabricacion?: number;
  capacidad_maxima?: number;
  capacidad_sentados?: number;
  capacidad_parados?: number;
  foto_base64?: string;
  estado?: string;
}

export type CreateBusDto = Omit<Bus, 'id' | 'bus_id'>;
export type UpdateBusDto = Bus;
