import { useAdvertisements, useDeleteAdvertisement } from '@/hooks/useAdvertisement'
import { Alert, Button, Col, Divider, Flex, Row, Space, Spin, Typography } from 'antd'
import { AdvertisementItem } from './AdvertisementItem'
import { PlusCircleOutlined } from '@ant-design/icons'

export function ListAdvertisement() {
  const { advData, advIsLoading, advIsError } = useAdvertisements()
  const { deleteAdvMutate } = useDeleteAdvertisement()

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
    <>
      <Flex align='center' justify='space-between' className='mb-3'>
        <Flex align='center'>
          <Typography.Title level={2} className='m-0'>
            Quảng Cáo
          </Typography.Title>
          <Divider type='vertical' className='mx-4 h-10 bg-gray-600' />
          
        </Flex>
        <Space>
          <Button icon={<PlusCircleOutlined />} shape='round' type='primary'>
            Thêm mới
          </Button>
        </Space>
        </Flex>
      <Row gutter={16} className='flex justify-center'>
        {advData?.map((ad) => (
          <Col span={7} key={ad.id}>
            <AdvertisementItem key={ad.id} advertisement={ad} onDelete={(id) => handleDelete(id)} />
          </Col>
        ))}
      </Row>
    </>
  )
}
