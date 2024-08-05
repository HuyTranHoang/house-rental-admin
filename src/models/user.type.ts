export interface User {
  id: number
  username: string
  email: string
  phoneNumber: string
  firstName: string
  lastName: string
  avatarUrl: string
  roles: string[]
  authorities: string[]
  active: boolean
  nonLocked: boolean
}
