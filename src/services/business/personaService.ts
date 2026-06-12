import { ENDPOINTS } from '../../api/endpoints';
import type { Persona, CreatePersonaDto, UpdatePersonaDto } from '../../models';
import { createCrudService } from './baseCrudService';

export const personaService = createCrudService<Persona, CreatePersonaDto, UpdatePersonaDto>(ENDPOINTS.BUSINESS.PERSONA);
export default personaService;
