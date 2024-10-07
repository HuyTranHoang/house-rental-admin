import {
    addMemberShip,
    deleteMemberships,
    deleteMemberShip,
    getAllMemberShipsWithPagination, getMemberShipById,
    updateMembership
  } from '@/api/membership.api'
  import { MemberShipFilter } from '@/types/membership.type'
  import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
  import { useCallback } from 'react'
  import { useSearchParams } from 'react-router-dom'
  import { toast } from 'sonner'
  
  export const useMemberShips = (search: string, pageNumber: number, pageSize: number, sortBy: string) => {
    const { data, isLoading, isError } = useQuery({
      queryKey: ['memberships', search, pageNumber, pageSize, sortBy],
      queryFn: () => getAllMemberShipsWithPagination(search, pageNumber, pageSize, sortBy)
    })
  
    return { data, isLoading, isError }
  }
  
  export const useMemberShip = (id: number) => {
    const { data: memberShipData, isLoading: memberShipIsLoading, isError } = useQuery({
      queryKey: ['memberships', id],
      queryFn: () => getMemberShipById(id),
      enabled: id !== 0
    })
  
    return { memberShipData, memberShipIsLoading, isError }
  }
  
  export const useDeleteMemberShip = () => {
    const queryClient = useQueryClient()
  
    const { mutateAsync: deleteMemberShipMutant, isPending: deleteMemberShipPending } = useMutation({
      mutationFn: deleteMemberShip,
      onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['memberships'] }),
      onError: (error) => toast.error(error.message)
    })
  
    return { deleteMemberShipMutant, deleteMemberShipPending }
  }
  
  export const useDeleteMutiMemberShip = () => {
    const queryClient = useQueryClient()
  
    const { mutateAsync: deleteMemberShipsMutate, isPending: deleteMemberShipsIsPending } = useMutation({
      mutationFn: deleteMemberships,
      onSuccess: () => queryClient.invalidateQueries({ queryKey: ['memberships'] }),
      onError: (error) => toast.error(error.message)
    })
  
    return { deleteMemberShipsMutate, deleteMemberShipsIsPending }
  }
  
  export const useCreateMemberShip = () => {
    const queryClient = useQueryClient()
  
    const { mutateAsync: addMemberShipMutate, isPending: addMemberShipPending } = useMutation({
      mutationFn: addMemberShip,
      onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['memberships'] }),
      onError: (error) => toast.error(error.message)
    })
  
    return { addMemberShipMutate, addMemberShipPending }
  }
  
  export const useUpdateMemberShip = () => {
    const queryClient = useQueryClient()
  
    const { mutateAsync: updateMemberShipMutate, isPending: updateMemberShipPending } = useMutation({
      mutationFn: updateMembership,
      onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['memberships'] }),
      onError: (error) => toast.error(error.message)
    })
  
    return { updateMemberShipMutate, updateMemberShipPending }
  }
  
  export const useMembershipFilters = () => {
    const [searchParams, setSearchParams] = useSearchParams()
  
    const search = searchParams.get('search') || ''
    const sortBy = searchParams.get('sortBy') || ''
    const pageNumber = parseInt(searchParams.get('pageNumber') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '5')
  
    const setFilters = useCallback(
      (filters: MemberShipFilter) => {
        setSearchParams(
          (params) => {
            if (filters.search !== undefined) {
              if (filters.search) {
                params.set('search', filters.search)
                params.set('pageNumber', '1')
              } else {
                params.delete('search')
              }
            }
  
            if (filters.pageNumber !== undefined) {
              params.set('pageNumber', String(filters.pageNumber))
            }
  
            if (filters.pageSize !== undefined) {
              params.set('pageSize', String(filters.pageSize))
            }
  
            if (filters.sortBy !== undefined) {
              if (filters.sortBy) {
                params.set('sortBy', filters.sortBy)
              } else {
                params.delete('sortBy')
              }
            }
  
            return params
          },
          { replace: true }
        )
      },
      [setSearchParams]
    )
  
    return { search, sortBy, pageNumber, pageSize, setFilters }
  }
  