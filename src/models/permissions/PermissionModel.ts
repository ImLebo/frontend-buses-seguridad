export type SystemAction = 'READ' | 'CREATE' | 'UPDATE' | 'DELETE';

export type SystemModule =
  | 'USERS'
  | 'ROLES'
  | 'PERMISSIONS'
  | 'BUSES'
  | 'ROUTES'
  | 'SCHEDULES'
  | 'REPORTS'
  | 'INCIDENTS'
  | 'MASS_MESSAGING';

export interface Permission {
  id: string;
  url?: string;
  method?: string;
  model?: string;
  module?: string;
  action?: string;
  createdAt?: string;
  createdBy?: string;
  isActive?: boolean;
}

export interface PermissionGrant {
  module: SystemModule | string;
  actions: (SystemAction | string)[];
}
