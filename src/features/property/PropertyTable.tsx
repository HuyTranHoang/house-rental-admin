import ConfirmModalContent from '@/components/ConfirmModalContent'
import ConfirmModalTitle from '@/components/ConfirmModalTitle'
import { useBlockProperty, useDeleteProperty, useUpdatePropertyStatus } from '@/hooks/useProperties'
import useBoundStore from '@/store.ts'
import { Property, PropertyDataSource, PropertyStatus } from '@/types/property.type'
import { hasAuthority } from '@/utils/filterMenuItem.ts'
import { formatCurrency } from '@/utils/formatCurrentcy'
import { blue } from '@ant-design/colors'
import { CheckOutlined, CloseOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import {
  Badge,
  Button,
  Col,
  ConfigProvider,
  Descriptions,
  DescriptionsProps,
  Flex,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Switch,
  Table,
  TableProps,
  Tag,
  Tooltip,
  Typography
} from 'antd'
import { SorterResult } from 'antd/lib/table/interface'
import DOMPurify from 'dompurify'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'

interface PropertyTableProps {
  status: PropertyStatus
  dataSource: PropertyDataSource[]
  loading: boolean
  paginationProps: false | TableProps<PropertyDataSource>['pagination']
  handleTableChange: TableProps<PropertyDataSource>['onChange']
  sortedInfo: SorterResult<PropertyDataSource>
}

function PropertyTable({
  status,
  dataSource,
  loading,
  paginationProps,
  handleTableChange,
  sortedInfo
}: PropertyTableProps) {
  const currentUser = useBoundStore((state) => state.user)

  const [open, setOpen] = useState(false)
  const [currentProperty, setCurrentProperty] = useState<Property | undefined>(undefined)

  const { updatePropertyStatus, updatePropertyStatusIsPending } = useUpdatePropertyStatus()
  const { blockProperty, blockPropertyIsPending } = useBlockProperty()
  const { t } = useTranslation(['common', 'property'])
  const { deleteProperty, deletePropertyIsPending } = useDeleteProperty()

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<PropertyDataSource | null>(null)
  const [form] = Form.useForm()
  const [isReject, setIsReject] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  const rejectReasons = [
    {
      value: t('property:rejectReasons.inappropriateContent'),
      label: t('property:rejectReasons.inappropriateContent')
    },
    {
      value: t('property:rejectReasons.inappropriateImage'),
      label: t('property:rejectReasons.inappropriateImage')
    },
    {
      value: t('property:rejectReasons.incorrectInformation'),
      label: t('property:rejectReasons.incorrectInformation')
    },
    {
      value: t('property:rejectReasons.duplicateListing'),
      label: t('property:rejectReasons.duplicateListing')
    },
    {
      value: 'other',
      label: t('property:rejectReasons.other')
    }
  ]

  const items: DescriptionsProps['items'] = [
    { key: 'title', label: t('property:table.title'), children: <span>{currentRecord?.title}</span>, span: 3 },
    { key: 'location', label: t('property:table.location'), children: <span>{currentRecord?.location}</span>, span: 3 },
    { key: 'price', label: t('property:table.price'), children: <span>{currentRecord?.price} VND</span>, span: 3 },
    { key: 'createdAt', label: t('common.table.createdAt'), children: <span>{currentRecord?.createdAt}</span>, span: 3 }
  ]
  const handleDelete = () => {
    if (currentRecord) {
      deleteProperty(currentRecord.id).then(() => {
        setCurrentRecord(null)
        setIsModalOpen(false)
        toast.success(t('property:notification.deleteSuccess'))
      })
    }
  }

  const handleRejectReasonChange = (value: string) => {
    setRejectReason(value)
    if (value !== 'other') {
      form.setFieldsValue({ customRejectReason: '' })
    }
  }

  const handleReject = () => {
    form.validateFields().then((values) => {
      updatePropertyStatus({
        id: currentProperty!.id,
        status: PropertyStatus.REJECTED,
        reason: values.rejectReason === 'other' ? values.customRejectReason : values.rejectReason
      }).then(() => {
        toast.success(t('property:notification.rejectedSuccess'))
        setOpen(false)
        setIsReject(false)
        setRejectReason('')
        form.resetFields()
      })
    })
  }

  const ModalFooter = (
    <Space>
      {status === PropertyStatus.PENDING && (
        <>
          {!isReject && (
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#00b96b'
                }
              }}
            >
              <Button
                loading={updatePropertyStatusIsPending}
                onClick={() => {
                  updatePropertyStatus({ id: currentProperty!.id, status: PropertyStatus.APPROVED }).then(() => {
                    toast.success(t('property:notification.approvedSuccess'))
                    setOpen(false)
                  })
                }}
                icon={<CheckOutlined />}
                disabled={!hasAuthority(currentUser, 'property:update')}
                type='primary'
              >
                {t('property:button.approved')}
              </Button>
            </ConfigProvider>
          )}
          <Button
            loading={updatePropertyStatusIsPending}
            onClick={() => {
              if (!isReject) {
                setIsReject(true)
              } else {
                handleReject()
              }
              // updatePropertyStatus({ id: currentProperty!.id, status: PropertyStatus.REJECTED }).then(() => {
              //   toast.success(t('property:notification.rejectedSuccess'))
              //   setOpen(false)
              // })
            }}
            icon={<CloseOutlined />}
            disabled={!hasAuthority(currentUser, 'property:update')}
            danger
          >
            {t('property:button.reject')}
          </Button>
        </>
      )}
      <Button
        onClick={() => {
          setOpen(false)
          setIsReject(false)
        }}
      >
        {t('common.back')}
      </Button>
    </Space>
  )

  const modalItems: DescriptionsProps['items'] = [
    {
      key: 'roomType',
      label: t('property:table.roomType'),
      children: currentProperty?.roomTypeName
    },
    {
      key: 'city',
      label: t('property:table.city'),
      children: currentProperty?.cityName
    },
    {
      key: 'district',
      label: t('property:table.district'),
      children: currentProperty?.districtName
    },
    {
      key: 'price',
      label: t('property:table.price'),
      children: currentProperty ? formatCurrency(currentProperty.price) : ''
    },
    {
      key: 'location',
      label: t('property:table.address'),
      children: currentProperty?.location,
      span: 2
    },
    {
      key: 'blocked',
      label: t('property:table.status'),
      children: (
        <Badge
          status={currentProperty?.blocked ? 'error' : 'success'}
          text={currentProperty?.blocked ? t('property:table.block') : t('property:table.isActive')}
        />
      ),
      span: 3
    },
    {
      key: 'area',
      label: t('property:table.area'),
      children: `${currentProperty?.area} m²`
    },
    {
      key: 'numRooms',
      label: t('property:table.numOfRoom'),
      children: currentProperty?.numRooms
    },
    {
      key: 'createdAt',
      label: t('common.table.createdAt'),
      children: currentProperty?.createdAt
    },
    {
      key: 'username',
      label: t('property:table.postedBy'),
      span: 1,
      children: currentProperty?.userName
    },
    {
      key: 'amenities',
      label: t('property:table.amenities'),
      span: 2,
      children: (
        <>
          {currentProperty?.amenities.map((amenity, index) => (
            <Tag key={index} color='blue'>
              {amenity}
            </Tag>
          ))}
        </>
      )
    },
    {
      key: 'description',
      label: t('property:table.description'),
      span: 3,
      children: (
        <>
          <Typography.Title level={5} style={{ margin: '0 0 12px' }}>
            {currentProperty?.title}
          </Typography.Title>
          <div
            dangerouslySetInnerHTML={{ __html: currentProperty ? DOMPurify.sanitize(currentProperty.description) : '' }}
          />
        </>
      )
    },
    {
      key: 'images',
      label: `${t('property:table.image')} (${currentProperty?.propertyImages.length})`,
      children: (
        <Row gutter={[8, 8]}>
          <Image.PreviewGroup>
            {currentProperty?.propertyImages.map((image, index) => (
              <Col key={index} span={6}>
                <Image
                  preview={{
                    mask: (
                      <>
                        <EyeOutlined style={{ marginRight: 6 }} /> Chi tiết
                      </>
                    )
                  }}
                  src={image}
                  alt={image}
                  className='size-48 object-cover p-2'
                />
              </Col>
            ))}
          </Image.PreviewGroup>
        </Row>
      )
    }
  ]

  const columns: TableProps<PropertyDataSource>['columns'] = [
    { title: '#', dataIndex: 'index', key: 'index', fixed: 'left', width: 50 },
    {
      title: t('property:table.title'),
      dataIndex: 'title',
      key: 'title',
      render: (_, record) => (
        <Typography.Text
          className='cursor-pointer text-blue-500'
          onClick={() => {
            setCurrentProperty(record)
            setOpen(true)
          }}
        >
          {record.title}
        </Typography.Text>
      )
    },
    // { title: t('property:table.location'), dataIndex: 'location', key: 'location' },
    {
      title: t('property:table.area'),
      dataIndex: 'area',
      key: 'area',
      sorter: true,
      sortOrder: sortedInfo.field === 'area' ? sortedInfo.order : null,
      width: 120,
      render: (record) => `${record} m²`
    },
    { title: t('property:table.roomType'), dataIndex: 'roomTypeName', key: 'roomTypeName', width: 150 },
    {
      title: t('property:table.city'),
      dataIndex: 'cityName',
      key: 'cityName',
      width: 150
    },
    { title: t('property:table.district'), dataIndex: 'districtName', key: 'districtName', width: 150 },
    {
      title: t('property:table.price'),
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      sortOrder: sortedInfo.field === 'price' ? sortedInfo.order : null,
      width: 60,
      render: (record) => formatCurrency(record)
    },
    {
      title: t('property:table.block'),
      dataIndex: 'blocked',
      key: 'blocked',
      width: 130,
      render: (blocked, record) => (
        <Switch
          loading={blockPropertyIsPending}
          checkedChildren={t('property:button.block')}
          unCheckedChildren={t('property:button.unblock')}
          defaultChecked={blocked}
          onChange={(e) => {
            const status = e ? 'block' : 'unblock'
            blockProperty({ id: record.id, status }).then(() => {
              if (status === 'block') {
                toast.success(t('property:notification.blockSuccess'))
              } else {
                toast.success(t('property:notification.unblockSuccess'))
              }
            })
          }}
          disabled={!hasAuthority(currentUser, 'property:update')}
        />
      )
    },
    {
      title: t('common.table.createdAt'),
      dataIndex: 'createdAt',
      key: 'createdAt',
      fixed: 'right',
      sorter: true,
      sortOrder: sortedInfo.field === 'createdAt' ? sortedInfo.order : null,
      width: 150
    },
    {
      title: t('common.table.action'),
      key: 'action',
      fixed: 'right',
      width: 110,
      render: (_, record) => (
        <Flex gap={16}>
          <Tooltip title={t('property:table.viewAndBrowse')}>
            <Button
              icon={<EyeOutlined />}
              type='default'
              style={{ borderColor: blue.primary, color: blue.primary }}
              onClick={() => {
                setCurrentProperty(record)
                setOpen(true)
              }}
            />
          </Tooltip>
          <Tooltip title={t('common.delete')}>
            <Button
              icon={<DeleteOutlined />}
              type='default'
              onClick={() => {
                setCurrentRecord(record)
                setIsModalOpen(true)
              }}
              disabled={!hasAuthority(currentUser, 'property:delete')}
              danger
            />
          </Tooltip>
        </Flex>
      )
    }
  ]

  if (status === PropertyStatus.PENDING || status === PropertyStatus.REJECTED) {
    columns.splice(8, 1)
  }

  return (
    <>
      <Table
        dataSource={dataSource}
        columns={columns}
        pagination={{
          position: ['bottomCenter'],
          pageSizeOptions: ['5', '10', '20'],
          locale: { items_per_page: `/ ${t('common.pagination.itemsPerPage')}` },
          showSizeChanger: true,
          ...paginationProps
        }}
        onChange={handleTableChange}
        loading={loading}
        locale={{
          triggerDesc: t('common.table.triggerDesc'),
          triggerAsc: t('common.table.triggerAsc'),
          cancelSort: t('common.table.cancelSort'),
          filterConfirm: t('common.table.filterConfirm'),
          filterReset: t('common.table.filterReset')
        }}
      />

      {currentProperty && (
        <Modal
          open={open}
          footer={ModalFooter}
          onCancel={() => {
            setOpen(false)
            setIsReject(false)
          }}
          width={1000}
        >
          <Typography.Title level={4}>{t('property:detail')}</Typography.Title>

          {!isReject && <Descriptions bordered items={modalItems} />}
          {isReject && (
            <Form layout='vertical' form={form}>
              <Form.Item
                label={t('property:table.rejectReason')}
                name='rejectReason'
                rules={[
                  {
                    required: true,
                    message: t('property:table.rejectReasonRequired')
                  }
                ]}
              >
                <Select
                  options={rejectReasons}
                  onChange={handleRejectReasonChange}
                  placeholder={t('property:table.selectRejectReason')}
                />
              </Form.Item>
              {rejectReason === 'other' && (
                <Form.Item
                  label={t('property:table.customRejectReason')}
                  name='customRejectReason'
                  rules={[
                    {
                      required: true,
                      message: t('property:table.customRejectReasonRequired')
                    }
                  ]}
                >
                  <Input.TextArea rows={4} />
                </Form.Item>
              )}
            </Form>
          )}
        </Modal>
      )}

      <Modal
        open={isModalOpen}
        className='w-96'
        title={<ConfirmModalTitle title={t('property:deleteModal.title')} />}
        okText={t('common.ok')}
        okType='danger'
        cancelText={t('common.cancel')}
        okButtonProps={{ loading: deletePropertyIsPending }}
        cancelButtonProps={{ disabled: deletePropertyIsPending }}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleDelete}
      >
        <ConfirmModalContent items={items} />
      </Modal>
    </>
  )
}

export default PropertyTable
