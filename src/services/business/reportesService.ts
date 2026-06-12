import { ENDPOINTS } from '../../api/endpoints';
import type { Reportes, CreateReportesDto, UpdateReportesDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const reportesService = createCrudService<Reportes, CreateReportesDto, UpdateReportesDto>(ENDPOINTS.BUSINESS.REPORTES);
export default reportesService;
