import { useQuery } from '@tanstack/react-query'
import { getAllAuthorities } from '../features/api/authority.api.ts'

export const useAuthorities = () => {

  const { data: authorities, isLoading } = useQuery({
    queryKey: ['authorities'],
    queryFn: getAllAuthorities
  })

  return { authorities, isLoading }
}