import type { Programacion, CreateProgramacionDto, UpdateProgramacionDto } from '../../models';
import { programacionService } from '../../services/business/programacionService';
import { useBusinessResource } from './useBusinessResource';

export const useProgramacion = () => useBusinessResource<Programacion, CreateProgramacionDto, UpdateProgramacionDto>(programacionService);
export default useProgramacion;
