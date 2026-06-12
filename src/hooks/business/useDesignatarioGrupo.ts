import type { DesignatarioGrupo, CreateDesignatarioGrupoDto, UpdateDesignatarioGrupoDto } from '../../models';
import { designatarioGrupoService } from '../../services/business/designatarioGrupoService';
import { useBusinessResource } from './useBusinessResource';

export const useDesignatarioGrupo = () => useBusinessResource<DesignatarioGrupo, CreateDesignatarioGrupoDto, UpdateDesignatarioGrupoDto>(designatarioGrupoService);
export default useDesignatarioGrupo;
