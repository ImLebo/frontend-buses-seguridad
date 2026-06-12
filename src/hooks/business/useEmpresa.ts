import type { Empresa, CreateEmpresaDto, UpdateEmpresaDto } from '../../models';
import { empresaService } from '../../services/business/empresaService';
import { useBusinessResource } from './useBusinessResource';

export const useEmpresa = () => useBusinessResource<Empresa, CreateEmpresaDto, UpdateEmpresaDto>(empresaService);
export default useEmpresa;
