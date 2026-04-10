import type { User } from './user.model'

export interface Profile {
  id?: string
  phone: string
  photo: string
  user?: User | null
}
