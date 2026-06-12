import { ENDPOINTS } from '../../api/endpoints';
import type { DesignatarioPersona, CreateDesignatarioPersonaDto, UpdateDesignatarioPersonaDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const designatarioPersonaService = createCrudService<DesignatarioPersona, CreateDesignatarioPersonaDto, UpdateDesignatarioPersonaDto>(ENDPOINTS.BUSINESS.DESIGNATARIO_PERSONA);
export default designatarioPersonaService;
