import { ENDPOINTS } from '../../api/endpoints';
import type { GrupoPersona, CreateGrupoPersonaDto, UpdateGrupoPersonaDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const grupoPersonaService = createCrudService<GrupoPersona, CreateGrupoPersonaDto, UpdateGrupoPersonaDto>(ENDPOINTS.BUSINESS.GRUPO_PERSONA);
export default grupoPersonaService;
