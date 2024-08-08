import { useQuery, useQueryClient } from '@tanstack/react-query'
import { Alert, Button, Divider, Empty, Flex, Form, FormProps, Input, PaginationProps, Space, Table, TableProps, Typography } from 'antd'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAllAmenitiesWithPagination } from '../api/amenity'
import { DeleteOutlined, FormOutlined, PlusCircleOutlined } from '@ant-design/icons'

const { Search } = Input

interface DataSourceType {
  key: React.Key
  id: number
  name: string
}

interface searchField {
  search?: string
}

type OnChange = NonNullable<TableProps<DataSourceType>['onChange']>
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function ListAmenity() {
    const navigate = useNavigate()
    const queryClient = useQueryClient()

    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('createdAtDesc')
    const [sortedInfo, setSortedInfo] = useState<Sorts>({})
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(5)

    const [deleteIdList, setDeleteIdList] = useState<number[]>([])

    const { data, isLoading, isError } = useQuery({
    queryKey: ['amentites', search, pageNumber, pageSize, sortBy],
    queryFn: () => getAllAmenitiesWithPagination(search, pageNumber, pageSize, sortBy)
    })


    const onFinish: FormProps<searchField>['onFinish'] = (values) => {
    setSearch(values.search || '')
    }

    const onShowSizeChange: PaginationProps['onShowSizeChange'] = (_, size) => {
        setPageSize(size)
        setPageNumber(1)
    }

    const handleTableChange: TableProps<DataSourceType>['onChange'] = (_, __, sorter) => {
        if (Array.isArray(sorter)) {
        // Handle the case where sorter is an array
        setSortBy('createdAtDesc')
        } else {
        if (sorter.order) {
            const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
            setSortBy(`${sorter.field}${order}`)
        }
        }

        setSortedInfo(sorter as Sorts)
    }

    const onPageChance: PaginationProps['onChange'] = (page) => {
        setPageNumber(prevState => {
        if (prevState === page) return prevState
        return page
    })
    }

    let dataSource: DataSourceType[] = []
    if (data) {
        dataSource = data.data.map((item, index) => ({
        key: item.id,
        id: (pageNumber - 1) * pageSize + index + 1,
        name: item.name
        }))
    }

    const rowSelection = {
        onChange: (selectedRowKeys: React.Key[], selectedRows: DataSourceType[]) => {
          console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows)
          const selectedIdList = selectedRows.map((row) => row.id)
          setDeleteIdList(selectedIdList)
        }
    }

    if (isError) {
        return (
        <>
            <Alert
            message='Lỗi'
            description='Có lỗi xảy ra trong quá trình lấy dữ liệu. Vui lòng thử lại sau.'
            type='error'
            showIcon
            style={{ marginBottom: '3rem' }}
            />

            <Empty />
        </>
        )
    }

    const columns: TableProps<DataSourceType>['columns'] = [
        {
        title: '#',
        dataIndex: 'id',
        key: 'id'
        },
        {
        title: 'Tên tiện nghi',
        dataIndex: 'name',
        key: 'name',
        sorter: true,
        sortOrder: sortedInfo.columnKey === 'name' ? sortedInfo.order : null
        },
        {
        title: 'Hành động',
        key: 'action',
        fixed: 'right',
        width: 200,
        render: (_, record) => (
            <Space size='middle'>
            <Button icon={<FormOutlined />} onClick={() => navigate(`/city/${record.id}/edit`)}>
                Cập nhật
            </Button>
            <Button icon={<DeleteOutlined />} type='default' danger>
                Xóa
            </Button>
            </Space>
        )
        }
    ]

    return (
        <>
        <Flex align='center' justify='space-between' style={{ marginBottom: 12 }}>
            <Flex align='center'>
            <Typography.Title level={2} style={{ margin: 0 }}>
                Danh sách tiện nghi
            </Typography.Title>
            <Divider type='vertical' style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
            <Form name='searchAmenity' initialValues={{ remember: true }} onFinish={onFinish} autoComplete='off'>
                <Form.Item<searchField> style={{ margin: 0 }} name='search'>
                <Search
                    allowClear
                    onSearch={(value) => setSearch(value)}
                    placeholder='Tìm kiếm tên tiện nghi'
                    style={{ width: 250 }}
                />
                </Form.Item>
            </Form>
            </Flex>

            <Space>
            {deleteIdList.length > 0 && (
                <Button shape='round' type='primary' danger >
                Xóa các mục đã chọn
                </Button>
            )}
            <Button icon={<PlusCircleOutlined />} shape='round' type='primary' onClick={() => navigate('/city/add')}>
                Thêm mới
            </Button>
            </Space>
        </Flex>

        {!data && <Table columns={columns} loading={isLoading} />}

        {data && <Table dataSource={dataSource}
                        columns={columns}
                        rowSelection={{
                            type: 'checkbox',
                            ...rowSelection
                        }}
                        pagination={{
                            total: data.pageInfo.totalElements,
                            position: ['bottomCenter'],
                            pageSize: pageSize,
                            current: pageNumber,
                            showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} tiện nghi`,
                            showSizeChanger: true,
                            onShowSizeChange: onShowSizeChange,
                            pageSizeOptions: ['5', '10', '20'],
                            locale: { items_per_page: '/ trang' },
                            onChange: onPageChance
                        }}
                        onChange={handleTableChange}
                        locale={{
                            triggerDesc: 'Sắp xếp giảm dần',
                            triggerAsc: 'Sắp xếp tăng dần',
                            cancelSort: 'Hủy sắp xếp'
                        }}
                        loading={isLoading}
        />}
        </>
    )
}

export default ListAmenity
