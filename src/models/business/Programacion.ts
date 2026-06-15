import type { BaseBusinessEntity } from './BaseBusinessEntity';
import type { Bus } from './Bus';
import type { Ruta } from './Ruta';
import type { Boleto } from './Boleto';

export interface Programacion extends BaseBusinessEntity {
  programacion_id?: number;
  ruta_id?: number;
  bus_id?: number;
  fecha?: string;
  hora_inicio?: string;
  hora_fin_estimada?: string;
  estado?: string;
  es_recurrente?: boolean;
  patron_recurrente?: string;
  margen_tolerancia_min?: number;
  visible_publico?: boolean;
  bus?: Bus;
  ruta?: Ruta;
  boletos?: Boleto[];
}

export type CreateProgramacionDto = Omit<Programacion, 'id' | 'programacion_id'>;
export type UpdateProgramacionDto = Programacion;
