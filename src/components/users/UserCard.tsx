import type { User } from '../../types';
import { BadgeStatus } from './shared';
import { Card } from '../ui';

interface UserCardProps {
  user: User;
}

export const UserCard = ({ user }: UserCardProps) => {
  return (
    <Card className="h-full" title={user.name}>
      <div className="space-y-1 text-sm text-slate-600">
        <p>{user.email}</p>
        <p>Rol: {user.role}</p>
        <div className="pt-2">
          <BadgeStatus status={user.status} />
        </div>
      </div>
    </Card>
  );
};
