import React from 'react'

export interface Role {
  id: number
  name: string
  description: string
  authorityPrivileges: string[]
  createdAt: string
}


export type RoleDataSource = Role & {
  key: React.Key
  index?: number
}