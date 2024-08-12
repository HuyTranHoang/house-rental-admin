import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addCity, deleteCities, deleteCity, getAllCities, getAllCitiesWithPagination, updateCity } from '@/api/city.api.ts'
import { toast } from 'sonner'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import React from 'react'

export const useCity = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['cities'],
    queryFn: getAllCities,
  });

  return { data, isLoading, isError, error };
};

export const useCities = (search: string,
                          pageNumber: number,
                          pageSize: number,
                          sortBy: string) => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['cities', search, pageNumber, pageSize, sortBy],
    queryFn: () => getAllCitiesWithPagination(search, pageNumber, pageSize, sortBy)
  })

  return { data, isLoading, isError }
}

export const useDeleteCity = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteCityMutate } = useMutation({
    mutationFn: deleteCity,
    onSuccess: () => {
      toast.success('Xóa thành phố thành công')
      queryClient.invalidateQueries({ queryKey: ['cities'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteCityMutate }
}

export const useDeleteMultiCity = () => {
  const queryClient = useQueryClient()

  const { mutate: deleteCitiesMutate } = useMutation({
    mutationFn: deleteCities,
    onSuccess: () => {
      toast.success('Xóa các thành phố thành công')
      queryClient.invalidateQueries({ queryKey: ['cities'] })
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return { deleteCitiesMutate }
}

export const useCreateCity = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: addCityMutate, isPending: addCityPending } = useMutation({
    mutationFn: addCity,
    onSuccess: () => {
      toast.success('Thêm thành phố thành công')
      queryClient.invalidateQueries({ queryKey: ['cities'] })

      navigate('/city')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  return { addCityMutate, addCityPending }
}

export const useUpdateCity = (setError: React.Dispatch<React.SetStateAction<string>>) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: updateCityMutate, isPending: updateCityPending } = useMutation({
    mutationFn: updateCity,
    onSuccess: () => {
      toast.success('Cập nhật thành phố thành công')
      queryClient.invalidateQueries({ queryKey: ['cities'] })
      navigate('/city')
    },
    onError: (error) => {
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        setError(error.response.data.message)
        return
      }

      toast.error(error.message)
    }
  })

  return { updateCityMutate, updateCityPending }
}
