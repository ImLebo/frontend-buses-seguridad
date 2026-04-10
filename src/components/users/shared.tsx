import { cn } from '../../utils/cn';
import type { UserStatus } from '../../types';

const statusClassMap: Record<UserStatus, string> = {
  active: 'bg-emerald-100 text-emerald-800',
  inactive: 'bg-slate-200 text-slate-700',
};

interface BadgeStatusProps {
  status: UserStatus;
}

export const BadgeStatus = ({ status }: BadgeStatusProps) => {
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize', statusClassMap[status])}>
      {status}
    </span>
  );
};
