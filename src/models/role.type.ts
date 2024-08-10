import React from 'react'

export interface Role {
  id: number
  name: string
  authorityPrivileges: string[]
  createdAt: string
}


export type RoleDataSource = Role & {
  key: React.Key
}