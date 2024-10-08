import { deleteAdvertisement, getAdvertisementById, getAllAdvertisements, updateIsActivedById } from "@/api/advertisement.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

export const useAdvertisements = () => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['advertisements'],
        queryFn: getAllAdvertisements
    })
    return {advData: data, advIsLoading: isLoading, advIsError: isError }
}

export const useAdvertisement = (id: number) => {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['advertisement', id],
        queryFn: () => getAdvertisementById(id),
        enabled: id !== 0
    })
    return {advData: data, advIsLoading: isLoading, advIsError: isError }
}

export const useUpdateIsActived = () => {
    const queryClient = useQueryClient()

    const { mutateAsync: updateAdvActive, isPending: updateAdvPending } = useMutation({
        mutationFn: (id: number) => updateIsActivedById(id),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ['advertisements'] })
            toast.success('Kích hoạt quảng cáo thành công')
        },
        onError: (error) => {
            toast.error(error.message)
        }
    })

    return { updateAdvActive, updateAdvPending }
}

export const useDeleteAdvertisement = () => {
    const queryClient = useQueryClient()

    const { mutateAsync: deleteAdvMutate, isPending: deleteAdvPending } = useMutation({
        mutationFn: deleteAdvertisement,
        onSuccess: async () => await queryClient.invalidateQueries({ queryKey: ['advertisements'] }),
        onError: (error) => toast.error(error.message)
      })
    
      return { deleteAdvMutate, deleteAdvPending }
}