import type { Mensaje, CreateMensajeDto, UpdateMensajeDto } from '../../models';
import { mensajeService } from '../../services/business/mensajeService';
import { useBusinessResource } from './useBusinessResource';

export const useMensaje = () => useBusinessResource<Mensaje, CreateMensajeDto, UpdateMensajeDto>(mensajeService);
export default useMensaje;
