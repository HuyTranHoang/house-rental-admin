import { useAdvertisements } from '@/hooks/useAdvertisement'
import { Alert, Button, Col, Divider, Flex, Row, Space, Spin, Typography } from 'antd'
import { AdvertisementItem } from './AdvertisementItem'
import { PlusCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import AddUpdateAdvertisement from './AddUpdateAdvertisement'

export function ListAdvertisement() {
  const { advData, advIsLoading, advIsError } = useAdvertisements()

  const [editId, setEditId] = useState<number>(0)
  const [formOpen, setFormOpen] = useState(false)

  const handeOpenForm = (id: number) => {
    setEditId(id)
    setFormOpen(true)
  }

  if (advIsLoading) return <Spin tip='Đang tải...' />
  if (advIsError) return <Alert message='Lỗi khi lấy quảng cáo' type='error' />

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
          <Button icon={<PlusCircleOutlined />} shape='round' type='primary' onClick={() => handeOpenForm(0)}>
            Thêm mới
          </Button>
        </Space>
        </Flex>
      <Row gutter={16} className='flex justify-center'>
        {advData?.map((ad) => (
          <Col span={7} key={ad.id}>
            <AdvertisementItem key={ad.id} advertisement={ad}/>
          </Col>
        ))}
      </Row>

      <AddUpdateAdvertisement id={editId} formOpen={formOpen} setFormOpen={setFormOpen} />
    </>
  )
}
