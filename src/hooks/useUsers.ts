import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllUserWithPagination, updateRoleForUser } from '@/api/user.api.ts'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'

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

export const useUpdateRoleForUser = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: updateRoleForUserMutate} = useMutation({
    mutationFn: ({ id, roles }: { id: number, roles: string[] }) => updateRoleForUser(id, roles),
    onSuccess: () => {
      toast.success('Cập nhật tài khoản thành công')
      queryClient.invalidateQueries({ queryKey: ['users'] })

      navigate('/user')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })
  return { updateRoleForUserMutate}
}