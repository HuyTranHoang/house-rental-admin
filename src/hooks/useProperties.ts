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
search: string, roomType: string, numOfDay: number, minPrice: number, maxPrice: number, minArea: number, maxArea: number, dictrict: string, city: string, pageNumber: number, pageSize: number, sortBy: string) => {
const { data, isLoading, isError } = useQuery({
queryKey: ['properties',  
    search,
    roomType,
    numOfDay,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    dictrict,
    city,
    pageNumber,
    pageSize,
    sortBy

],
queryFn: () => getAllPropertyWithPagination(
    search,
    roomType,
    numOfDay,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    dictrict,
    city,
    pageNumber,
    pageSize,
    sortBy
)
})



return { data, isLoading, isError }
}