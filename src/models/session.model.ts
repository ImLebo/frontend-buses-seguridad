import type { User } from './user.model'

export interface Session {
  id?: string
  token?: string
  expiration?: string
  code2FA?: string
  otpAttempts?: number
  otpVerified?: boolean
  partialAuth?: boolean
  createdAt?: string
  user?: User
}
