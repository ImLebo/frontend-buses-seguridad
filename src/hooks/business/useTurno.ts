import type { Turno, CreateTurnoDto, UpdateTurnoDto } from '../../models';
import { turnoService } from '../../services/business/turnoService';
import { useBusinessResource } from './useBusinessResource';

export const useTurno = () => useBusinessResource<Turno, CreateTurnoDto, UpdateTurnoDto>(turnoService);
export default useTurno;
