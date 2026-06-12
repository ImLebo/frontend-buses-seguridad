import type { Boleto, CreateBoletoDto, UpdateBoletoDto } from '../../models';
import { boletoService } from '../../services/business/boletoService';
import { useBusinessResource } from './useBusinessResource';

export const useBoleto = () => useBusinessResource<Boleto, CreateBoletoDto, UpdateBoletoDto>(boletoService);
export default useBoleto;
