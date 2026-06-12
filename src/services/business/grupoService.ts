import { ENDPOINTS } from '../../api/endpoints';
import type { Grupo, CreateGrupoDto, UpdateGrupoDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const grupoService = createCrudService<Grupo, CreateGrupoDto, UpdateGrupoDto>(ENDPOINTS.BUSINESS.GRUPO);
export default grupoService;
