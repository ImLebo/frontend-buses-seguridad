import type { Role } from './role.model'

export interface UserWithRolesResponse {
  id: string
  name: string
  lastName: string
  email: string
  roles: Role[]
}
