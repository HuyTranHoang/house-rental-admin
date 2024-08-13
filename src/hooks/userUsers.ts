import { useQuery } from '@tanstack/react-query'
import { getAllUserWithPagination } from '@/api/user.api.ts'

export const useUsers = (search: string,
                         isNonLocked: boolean,
                         roles: string,
                         pageNumber: number,
                         pageSize: number,
                         sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['users', search, isNonLocked, roles, pageNumber, pageSize, sortBy],
    queryFn: () => getAllUserWithPagination(search, isNonLocked, roles, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}