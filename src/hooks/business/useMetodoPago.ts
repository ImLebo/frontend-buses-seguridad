import type { MetodoPago, CreateMetodoPagoDto, UpdateMetodoPagoDto } from '../../models';
import { metodoPagoService } from '../../services/business/metodoPagoService';
import { useBusinessResource } from './useBusinessResource';

export const useMetodoPago = () => useBusinessResource<MetodoPago, CreateMetodoPagoDto, UpdateMetodoPagoDto>(metodoPagoService);
export default useMetodoPago;
