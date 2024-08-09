import { useQuery } from '@tanstack/react-query'
import { getAllRolesWithPagination } from '../features/api/role.api.ts'

export const useRoles = (search: string,
                         authorities: string,
                         pageNumber: number,
                         pageSize: number,
                         sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['roles', search, authorities, pageNumber, pageSize, sortBy],
    queryFn: () => getAllRolesWithPagination(search, authorities, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}