import { useAdvertisements, useDeleteAdvertisement } from '@/hooks/useAdvertisement'
import { Alert, Button, Card, Col, Image, Row, Spin } from 'antd'

export function AdvertisementList() {
  const { advData, advIsLoading, advIsError } = useAdvertisements()
  const { deleteAdvMutate, deleteAdvPending } = useDeleteAdvertisement()

  if (advIsLoading) return <Spin tip='Đang tải...' />
  if (advIsError) return <Alert message='Lỗi khi lấy quảng cáo' type='error' />

  const handleDelete = async (id: number) => {
    try {
      await deleteAdvMutate(id)
    } catch (error) {
      console.error('Xóa quảng cáo thất bại:', error)
    }
  }

  return (
    <Row gutter={16}>
      {advData?.map((ad) => (
        <Col span={8} key={ad.id}>
          <Card title={ad.name}>
            <Image src={ad.imageUrl}></Image>
            <Button onClick={() => handleDelete(ad.id)} type='primary' danger loading={deleteAdvPending}>
              Xoá
            </Button>
          </Card>
        </Col>
      ))}
    </Row>
  )
}
