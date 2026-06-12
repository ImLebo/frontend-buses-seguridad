import type { Persona, CreatePersonaDto, UpdatePersonaDto } from '../../models';
import { personaService } from '../../services/business/personaService';
import { useBusinessResource } from './useBusinessResource';

export const usePersona = () => useBusinessResource<Persona, CreatePersonaDto, UpdatePersonaDto>(personaService);
export default usePersona;
