import { deleteProperty, getAllPropertyWithPagination, getPropertyById, updatePropertyStatus } from "@/api/property.api"
import { Property, UpdatePropertyStatusVariables } from "@/models/property.type";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner";

export const usePropertyById = (id: number) => {
  return useQuery<Property, Error>({
    queryKey: ['property', id], 
    queryFn: () => getPropertyById(id),
    enabled: !!id, 
    retry: false, 
  });
};
export function useUpdatePropertyStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (variables: UpdatePropertyStatusVariables) => updatePropertyStatus(variables),
    onSuccess: () => {
      toast.success('Cập nhật trạng thái thành công');
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Đã xảy ra lỗi không xác định.');
      }
    }
  });

  return mutation;
}

export function useDeleteProperty() {
    const queryClient = useQueryClient()
    const mutation = useMutation({
      mutationFn: (id: number) => deleteProperty(id),
      onSuccess: () => {
        toast.success('Xóa bài đăng thành công')
        queryClient.invalidateQueries({ queryKey: ['properies'] })
      },
      onError: (error: Error) => {
        toast.error('Xóa bài đăng thất bại' + error.message)
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