import { ENDPOINTS } from '../../api/endpoints';
import type { Boleto, CreateBoletoDto, UpdateBoletoDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const boletoService = createCrudService<Boleto, CreateBoletoDto, UpdateBoletoDto>(ENDPOINTS.BUSINESS.BOLETO);
export default boletoService;
