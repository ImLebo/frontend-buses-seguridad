import type { Nodo, CreateNodoDto, UpdateNodoDto } from '../../models';
import { nodoService } from '../../services/business/nodoService';
import { useBusinessResource } from './useBusinessResource';

export const useNodo = () => useBusinessResource<Nodo, CreateNodoDto, UpdateNodoDto>(nodoService);
export default useNodo;
