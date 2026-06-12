import type { Recarga, CreateRecargaDto, UpdateRecargaDto } from '../../models';
import { recargaService } from '../../services/business/recargaService';
import { useBusinessResource } from './useBusinessResource';

export const useRecarga = () => useBusinessResource<Recarga, CreateRecargaDto, UpdateRecargaDto>(recargaService);
export default useRecarga;
