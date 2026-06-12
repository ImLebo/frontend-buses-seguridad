import type { Ruta, CreateRutaDto, UpdateRutaDto } from '../../models';
import { rutaService } from '../../services/business/rutaService';
import { useBusinessResource } from './useBusinessResource';

export const useRuta = () => useBusinessResource<Ruta, CreateRutaDto, UpdateRutaDto>(rutaService);
export default useRuta;
