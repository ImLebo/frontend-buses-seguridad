import type { Foto, CreateFotoDto, UpdateFotoDto } from '../../models';
import { fotoService } from '../../services/business/fotoService';
import { useBusinessResource } from './useBusinessResource';

export const useFoto = () => useBusinessResource<Foto, CreateFotoDto, UpdateFotoDto>(fotoService);
export default useFoto;
