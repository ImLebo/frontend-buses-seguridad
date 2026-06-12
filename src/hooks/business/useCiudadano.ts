import type { Ciudadano, CreateCiudadanoDto, UpdateCiudadanoDto } from '../../models';
import { ciudadanoService } from '../../services/business/ciudadanoService';
import { useBusinessResource } from './useBusinessResource';

export const useCiudadano = () => useBusinessResource<Ciudadano, CreateCiudadanoDto, UpdateCiudadanoDto>(ciudadanoService);
export default useCiudadano;
