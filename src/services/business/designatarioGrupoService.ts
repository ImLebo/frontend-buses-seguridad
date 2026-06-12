import { ENDPOINTS } from '../../api/endpoints';
import type { DesignatarioGrupo, CreateDesignatarioGrupoDto, UpdateDesignatarioGrupoDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const designatarioGrupoService = createCrudService<DesignatarioGrupo, CreateDesignatarioGrupoDto, UpdateDesignatarioGrupoDto>(ENDPOINTS.BUSINESS.DESIGNATARIO_GRUPO);
export default designatarioGrupoService;
