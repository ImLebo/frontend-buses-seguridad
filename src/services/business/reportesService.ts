import { httpClient } from '../../api/httpClient';

export interface IngresosMetodoReporte {
  mes: string;
  metodos: {
    efectivo: number;
    tarjeta: number;
    prepagado: number;
  };
  total: number;
}

export interface RangoEtario {
  nombre: string;
  cantidad: number;
  porcentaje: number;
  variacionMesAnterior: number;
}

export interface PasajerosPorEdadReporte {
  rangos: RangoEtario[];
  segmentoPredominante: string;
}

export const reportesService = {
  ingresosPorMetodo: async (meses: number = 6) => {
    const response = await httpClient.get<IngresosMetodoReporte[]>(`/reportes/ingresos-por-metodo`, {
      params: { meses }
    });
    return response;
  },

  pasajerosPorEdad: async (rutaId?: number, fechaInicio?: string, fechaFin?: string) => {
    const response = await httpClient.get<PasajerosPorEdadReporte>(`/reportes/pasajeros-por-edad`, {
      params: { rutaId, fechaInicio, fechaFin }
    });
    return response;
  }
};

export default reportesService;
