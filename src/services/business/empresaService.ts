import { ENDPOINTS } from '../../api/endpoints';
import type { Empresa, CreateEmpresaDto, UpdateEmpresaDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const empresaService = createCrudService<Empresa, CreateEmpresaDto, UpdateEmpresaDto>(ENDPOINTS.BUSINESS.EMPRESA);
export default empresaService;
