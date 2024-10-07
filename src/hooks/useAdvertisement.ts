import { deleteAdvertisement, getAdvertisementById, getAllAdvertisements } from "@/api/advertisement.api"
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
        queryKey: ['city', id],
        queryFn: () => getAdvertisementById(id),
        enabled: id !== 0
    })
    return {advData: data, advIsLoading: isLoading, advIsError: isError }
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