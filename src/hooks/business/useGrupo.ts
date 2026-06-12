import type { Grupo, CreateGrupoDto, UpdateGrupoDto } from '../../models';
import { grupoService } from '../../services/business/grupoService';
import { useBusinessResource } from './useBusinessResource';

export const useGrupo = () => useBusinessResource<Grupo, CreateGrupoDto, UpdateGrupoDto>(grupoService);
export default useGrupo;
