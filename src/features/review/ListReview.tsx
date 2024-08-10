import { useState } from "react"
import { Review } from "../../models/review.type"
import { useReviews } from "../../hooks/useReviews"
import { Button, Divider, Flex, Space, TableProps, Typography } from "antd"
import { useSetBreadcrumb } from "../../hooks/useSetBreadcrumb"
import { Link, useNavigate } from "react-router-dom"
import ErrorFetching from "../../components/ErrorFetching"
import Search from "antd/es/input/Search"
import { PlusCircleOutlined } from "@ant-design/icons"
import ReviewTable from "./ReviewTable"


type DataSourceType = Review & {
    key: React.Key
  }


  
function ListReview() {
    const navigate = useNavigate()

    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('IdDesc')
    const [pageNumber, setPageNumber] = useState(1)
    const [pageSize, setPageSize] = useState(5)

    const [deleteIdList, setDeleteIdList] = useState<number[]>([])

    const { data, isLoading, isError } = useReviews(search, pageNumber, pageSize, sortBy);

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
            ? data.data.map((review: Review) => ({
            key: review.id,
            id: review.id,
            userId: review.userId,
            username: review.userName,
            propertyId: review.propertyId,
            title: review.propertyTitle,
            rating: review.rating,
            comment: review.comment,

        //   createdAt: customFormatDate(amenity.createdAt)
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
            { title: 'Danh sách đánh giá' }
        ])

        if (isError) {
            return <ErrorFetching />
        }


    return(
        <>
            <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
            <Flex align="center">
            <Typography.Title level={2} style={{ margin: 0 }}>
                Danh sách đánh giá
            </Typography.Title>
            <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
            <Search allowClear onSearch={(value) => setSearch(value)} placeholder="Tìm kiếm đánh giá"
                    style={{ width: 250 }}
            />
            </Flex>

            <Space>
            {deleteIdList.length > 0 && (
                <Button shape="round" type="primary" danger>
                Xóa các mục đã chọn
                </Button>
            )}
            <Button icon={<PlusCircleOutlined />} shape="round" type="primary" onClick={() => navigate('/review/add')}>
                Thêm mới
            </Button>
            </Space>
            </Flex>

            <ReviewTable
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

export default ListReview