import type { User } from './user.model'

export interface PasswordResetToken {
  id?: string
  token: string
  expiration: string
  used: boolean
  user: User
}
