import { httpClient } from '../../api/httpClient';
import { ENDPOINTS } from '../../api/endpoints';
import type { Recarga, CreateRecargaDto, UpdateRecargaDto } from '../../models';
import { createCrudService } from './baseCrudService';

export interface IniciarRecargaDto {
  metodo_pago_ciudadano_id: number;
  monto: number;
}

export interface IniciarRecargaResponse {
  referencia: string;
  monto: string;
  descripcion: string;
  email: string | null;
  saldoActual: string;
  saldoDespues: string;
}

export const recargaService = {
  ...createCrudService<Recarga, CreateRecargaDto, UpdateRecargaDto>(ENDPOINTS.BUSINESS.RECARGA),
  
  iniciar: async (dto: IniciarRecargaDto) => {
    const response = await httpClient.post<IniciarRecargaResponse>(`${ENDPOINTS.BUSINESS.RECARGA}/iniciar`, dto);
    return response;
  },

  // Simulates the webhook that ePayco would call from their servers
  confirmarWebhookSimulado: async (referencia: string, estadoTransaccion: 'Aceptada' | 'Rechazada') => {
    const payload = {
      x_ref: referencia,
      x_transaction_state: estadoTransaccion,
      simulado: true
    };
    // Send it to the confirmation endpoint to process the balance
    const response = await httpClient.post(`${ENDPOINTS.BUSINESS.RECARGA}/confirmar`, payload);
    return response;
  }
};

export default recargaService;
