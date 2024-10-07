import React from 'react'

export interface MemberShip {
    id: number
    name: string
    price: number
    durationDays: number
    priority: number
    refresh: number
    description: string
    createdAt: string
  }

  export type MemberShipDataSource = MemberShip & {
    key: React.Key
    index?: number
  }
  
  export type MemberShipFilter = {
    search?: string
    sortBy?: string
    pageNumber?: number
    pageSize?: number
  }
  
  export interface MemberShipForm {
    id : number
    name: string
    price: number
    durationDays: number
    priority: number
    refresh: number
    description: string
  }
  