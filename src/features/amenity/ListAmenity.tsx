import {
  Button,
  Divider,
  Flex,
  Input, Modal,
  Space,
  TableProps,
  Typography
} from 'antd'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ExclamationCircleFilled, PlusCircleOutlined } from '@ant-design/icons'
import { useSetBreadcrumb } from '../../hooks/useSetBreadcrumb'
import { useAmenities, useDeleteMultiAmenity } from './useAmenities.ts'
import AmenityTable from './AmenityTable.tsx'
import { AmenityType } from '../../models/amenity.type.ts'
import { customFormatDate } from '../../utils/customFormatDate.ts'
import ErrorFetching from '../../components/ErrorFetching.tsx'

const { Search } = Input
const { confirm } = Modal

type DataSourceType = AmenityType & {
  key: React.Key
}

function ListAmenity() {
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('IdDesc')
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const [deleteIdList, setDeleteIdList] = useState<number[]>([])

  const { data, isLoading, isError } = useAmenities(search, pageNumber, pageSize, sortBy)
  const { deleteAmenitiesMutate } = useDeleteMultiAmenity()

  const showDeleteConfirm = (deleteIdList: number[]) => {

    confirm({
      title: 'Bạn có chắc chắn muốn xóa các tiện nghi đã chọn?',
      icon: <ExclamationCircleFilled />,
      content: <p>Lưu ý: Hành động này không thể hoàn tác</p>,
      okText: 'Xác nhận',
      okType: 'danger',
      cancelText: 'Hủy',
      maskClosable: true,
      onOk() {
        deleteAmenitiesMutate(deleteIdList)
        setDeleteIdList([])
      }
    })
  }


  const handleTableChange: TableProps<DataSourceType>['onChange'] = (_, __, sorter) => {
    if (Array.isArray(sorter)) {
      setSortBy('createdAtDesc')
    } else {
      if (sorter.order) {
        const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
        setSortBy(`${sorter.field}${order}`)
      }
    }
  }

  const dataSource: DataSourceType[] = data
    ? data.data.map((amenity: AmenityType) => ({
      key: amenity.id,
      id: amenity.id,
      name: amenity.name,
      createdAt: customFormatDate(amenity.createdAt)
    }))
    : []

  const rowSelection = {
    onChange: (_selectedRowKeys: React.Key[], selectedRows: DataSourceType[]) => {
      const selectedIdList = selectedRows.map((row) => row.id)
      setDeleteIdList(selectedIdList)
    }
  }

  useSetBreadcrumb([
    { title: <Link to={'/'}>Dashboard</Link> },
    { title: 'Danh sách tiện nghi' }
  ])

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
        <Flex align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>
            Danh sách tiện nghi
          </Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Search allowClear onSearch={(value) => setSearch(value)} placeholder="Tìm kiếm tên tiện nghi"
                  style={{ width: 250 }}
          />
        </Flex>

        <Space>
          {deleteIdList.length > 0 && (
            <Button shape="round" type="primary" danger onClick={() => showDeleteConfirm(deleteIdList)}>
              Xóa các mục đã chọn
            </Button>
          )}
          <Button icon={<PlusCircleOutlined />} shape="round" type="primary" onClick={() => navigate('/amenity/add')}>
            Thêm mới
          </Button>
        </Space>
      </Flex>

      <AmenityTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} tiện nghi`,
          onShowSizeChange: (_, size) => setPageSize(size),
          onChange: (page) => setPageNumber(page)
        }}
        handleTableChange={handleTableChange}
        rowSelection={{
          type: 'checkbox',
          ...rowSelection
        }}
      />
    </>
  )
}

export default ListAmenity
