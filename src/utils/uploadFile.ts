import type { GetProp, UploadProps } from 'antd'
import type { UploadFile } from 'antd/es/upload/interface'
import { toast } from 'sonner'

export type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

export const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = (error) => reject(error)
  })

export const validateFile = (file: UploadFile) => {
  const isValidType = file.type?.startsWith('image/') ?? false
  const isValidSize = (file.size ?? 0) / 1024 / 1024 < 2

  if (!isValidType) {
    toast.error('Chỉ được tải lên các tệp hình ảnh.')
  }

  if (!isValidSize) {
    toast.error('Hình ảnh phải nhỏ hơn 2MB.')
  }

  return isValidType && isValidSize
}
