import type { BaseBusinessEntity } from './BaseBusinessEntity';

export interface Ruta extends BaseBusinessEntity {
  ruta_id?: number;
  codigo?: string;
  nombre?: string;
  descripcion?: string;
  tarifa?: number;
  activa?: boolean;
}

export type CreateRutaDto = Omit<Ruta, 'id' | 'ruta_id'>;
export type UpdateRutaDto = Ruta;

export interface ParaderoRuta {
  orden: number;
  paradero: {
    paradero_id: number;
    codigo?: string;
    nombre: string;
    descripcion?: string;
    latitud: number | string;
    longitud: number | string;
    activo?: boolean;
  };
}

export interface RutaDisponible {
  ruta_id: number;
  nombre: string;
  descripcion?: string;
  tarifa: number | string;
  tiempo_estimado_total_min: number;
  paraderos: ParaderoRuta[];
}
