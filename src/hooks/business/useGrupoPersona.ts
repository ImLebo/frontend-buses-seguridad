import type { GrupoPersona, CreateGrupoPersonaDto, UpdateGrupoPersonaDto } from '../../models';
import { grupoPersonaService } from '../../services/business/grupoPersonaService';
import { useBusinessResource } from './useBusinessResource';

export const useGrupoPersona = () => useBusinessResource<GrupoPersona, CreateGrupoPersonaDto, UpdateGrupoPersonaDto>(grupoPersonaService);
export default useGrupoPersona;
