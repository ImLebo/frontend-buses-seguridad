import type { Reportes, CreateReportesDto, UpdateReportesDto } from '../../models';
import { reportesService } from '../../services/business/reportesService';
import { useBusinessResource } from './useBusinessResource';

export const useReportes = () => useBusinessResource<Reportes, CreateReportesDto, UpdateReportesDto>(reportesService);
export default useReportes;
