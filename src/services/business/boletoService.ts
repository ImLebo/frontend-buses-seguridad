import { ENDPOINTS } from '../../api/endpoints';
import { httpClient } from '../../api/httpClient';
import type { Boleto, CreateBoletoDto, UpdateBoletoDto } from '../../models';
import { createCrudService } from './baseCrudService';

export interface AbordaBoletoDto {
  ciudadanoId: number;
  programacionId: number;
  metodoPagoCiudadanoId: number;
  paraderoAbordajeId: number;
}

export interface DescenderBoletoDto {
  paraderoDescensoId: number;
}

export interface RecorridoInfo {
  ruta: {
    ruta_id: number;
    nombre: string;
    paraderos: {
      orden: number;
      paradero: {
        paradero_id: number;
        nombre: string;
        direccion?: string;
        latitud?: number;
        longitud?: number;
      };
    }[];
  };
  paraderoAbordaje: any;
  paraderoDescenso: any;
  horaAbordaje: string;
  horaDescenso: string | null;
  tiempoTotalMinutos: number | null;
  placaBus: string | null;
  conductor: string | null;
}

const baseCrud = createCrudService<Boleto, CreateBoletoDto, UpdateBoletoDto>(ENDPOINTS.BUSINESS.BOLETO);

export const boletoService = {
  ...baseCrud,
  abordar: (dto: AbordaBoletoDto) =>
    httpClient.post<{
      boleto: Boleto;
      saldoRestante: string;
      mensaje: string;
    }>(`${ENDPOINTS.BUSINESS.BOLETO}/abordar`, dto),

  descender: (boletoId: number, dto: DescenderBoletoDto) =>
    httpClient.post<{
      boleto: Boleto;
      mensaje: string;
    }>(`${ENDPOINTS.BUSINESS.BOLETO}/${boletoId}/descender`, dto),

  recorrido: (boletoId: number) =>
    httpClient.get<RecorridoInfo>(`${ENDPOINTS.BUSINESS.BOLETO}/${boletoId}/recorrido`),
};

export default boletoService;
