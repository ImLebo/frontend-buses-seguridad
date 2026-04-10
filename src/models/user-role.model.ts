import type { Role } from './role.model'
import type { User } from './user.model'

export interface UserRole {
  id?: string
  user: User
  role: Role
}
