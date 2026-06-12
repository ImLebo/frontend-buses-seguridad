import type { MetodoPagoCiudadano, CreateMetodoPagoCiudadanoDto, UpdateMetodoPagoCiudadanoDto } from '../../models';
import { metodoPagoCiudadanoService } from '../../services/business/metodoPagoCiudadanoService';
import { useBusinessResource } from './useBusinessResource';

export const useMetodoPagoCiudadano = () => useBusinessResource<MetodoPagoCiudadano, CreateMetodoPagoCiudadanoDto, UpdateMetodoPagoCiudadanoDto>(metodoPagoCiudadanoService);
export default useMetodoPagoCiudadano;
