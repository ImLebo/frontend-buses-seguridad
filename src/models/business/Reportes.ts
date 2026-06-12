import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Reportes extends BaseBusinessEntity {
  reporte_id?: number;
  tipo?: string;
  descripcion?: string;
  fecha_generacion?: string;
  datos?: string;
}

export type CreateReportesDto = Omit<Reportes, 'id' | 'reporte_id'>;
export type UpdateReportesDto = Reportes;
