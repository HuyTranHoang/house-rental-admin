import { deleteProperty, getAllPropertyWithPagination } from "@/api/property.api"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export function useDeleteProperty() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
      mutationFn: (id: number) => deleteProperty(id),
      onSuccess: () => {
        toast.success('Xóa bài đăng thành công')
        queryClient.invalidateQueries({ queryKey: ['properies'] })
      },
      onError: (error: Error) => {
        toast.error(error.message)
      },
    });
  
    return mutation;
  }

export const useProperty = (
search: string, roomTypeId: number, numOfDay: number, minPrice: number, maxPrice: number, minArea: number, maxArea: number, dictrictId: number, cityId: number, pageNumber: number, pageSize: number, sortBy: string, status: string) => {
const { data, isLoading, isError } = useQuery({
queryKey: ['properties',  
    search,
    roomTypeId,
    numOfDay,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    dictrictId,
    cityId,
    pageNumber,
    pageSize,
    sortBy,
    status,

],
queryFn: () => getAllPropertyWithPagination(
    search,
    roomTypeId,
    numOfDay,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    dictrictId,
    cityId,
    pageNumber,
    pageSize,
    sortBy,
    status
)
})



return { data, isLoading, isError }
}