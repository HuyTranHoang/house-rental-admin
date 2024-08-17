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
  createdAt: string
}

export type UserDataSource = User & {
  key: React.Key
  index?: number
}