import type { DesignatarioPersona, CreateDesignatarioPersonaDto, UpdateDesignatarioPersonaDto } from '../../models';
import { designatarioPersonaService } from '../../services/business/designatarioPersonaService';
import { useBusinessResource } from './useBusinessResource';

export const useDesignatarioPersona = () => useBusinessResource<DesignatarioPersona, CreateDesignatarioPersonaDto, UpdateDesignatarioPersonaDto>(designatarioPersonaService);
export default useDesignatarioPersona;
