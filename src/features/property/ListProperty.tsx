import { Cascader, Divider, Flex, Form, Input, Select, TableProps, Tabs, TabsProps, Typography } from 'antd'
import { useQueryClient } from '@tanstack/react-query'

import { Property as PropertyType, PropertyDataSource, PropertyStatus } from '@/models/property.type'
import { useProperties, usePropertyFilters } from '@/hooks/useProperties'
import PropertyTable from './PropertyTable'
import ErrorFetching from '@/components/ErrorFetching'
import { customFormatDate } from '@/utils/customFormatDate'
import { CheckCircleOutlined, CloseSquareOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useCitiesAll } from '@/hooks/useCities.ts'
import { useDistrictsAll } from '@/hooks/useDistricts.ts'
import { useEffect, useState } from 'react'
import { GeoIcon, HomeIcon } from '@/components/FilterIcons.tsx'
import { useRoomTypesAll } from '@/hooks/useRoomTypes.ts'

const { Search } = Input

interface Option {
  value: string
  label: string
  children?: Option[]
}

type OnChange = NonNullable<TableProps<PropertyDataSource>['onChange']>
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

const tabsItem: TabsProps['items'] = [
  { key: PropertyStatus.PENDING, label: 'Chờ xử lý', icon: <ExclamationCircleOutlined /> },
  { key: PropertyStatus.APPROVED, label: 'Đã duyệt', icon: <CheckCircleOutlined /> },
  { key: PropertyStatus.REJECTED, label: 'Đã từ chối', icon: <CloseSquareOutlined /> }
]

function ListProperty() {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()

  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const { search, cityId, districtId, roomTypeId, status, pageNumber, pageSize, sortBy, setFilters } =
    usePropertyFilters()

  const { data, isLoading, isError } = useProperties(
    search,
    cityId,
    districtId,
    roomTypeId,
    status,
    pageNumber,
    pageSize,
    sortBy
  )

  // Start City and District
  const { cityData, cityIsLoading } = useCitiesAll()
  const { districtData, districtIsLoading } = useDistrictsAll()
  const cityDistrictOptions: Option[] = [{ value: '0', label: 'Toàn Quốc' }]
  if (cityData && districtData) {
    const cityMap = cityData.map((city) => ({
      value: city.id.toString(),
      label: city.name,
      children: [
        { value: '0', label: 'Tất cả' },
        ...districtData
          .filter((district) => district.cityId === city.id)
          .map((district) => ({
            value: district.id.toString(),
            label: district.name
          }))
      ]
    }))
    cityDistrictOptions.push(...cityMap)
  }
  const handleCityDistrictChange = (value: string[]) => {
    console.log(value)

    if (value.length === 2) {
      setFilters({ cityId: parseInt(value[0]), districtId: parseInt(value[1]) })
    } else {
      setFilters({ cityId: 0, districtId: 0 })
    }
  }
  // End City and District

  // Start Room Type
  const { roomTypeData, roomTypeIsLoading } = useRoomTypesAll()
  const roomTypeOptions: Option[] = [{ value: '0', label: 'Tất cả' }]
  if (roomTypeData) {
    roomTypeOptions.push(
      ...roomTypeData.map((roomType) => ({
        value: roomType.id.toString(),
        label: roomType.name
      }))
    )
  }
  // End Room Type

  const onTabChange = (key: string) => {
    setFilters({ status: key as PropertyType['status'] })
    queryClient.invalidateQueries({ queryKey: ['properties'] })
  }

  const handleTableChange: TableProps<PropertyDataSource>['onChange'] = (_, __, sorter) => {
    if (!Array.isArray(sorter) && sorter.order) {
      const order = sorter.order === 'ascend' ? 'Asc' : 'Desc'
      setFilters({ sortBy: `${sorter.field}${order}` })
    } else {
      setFilters({ sortBy: '' })
      setSortedInfo({})
    }
  }

  const dataSource: PropertyDataSource[] = data
    ? data.data
        .filter((property) => property.status === status)
        .map((property, idx) => ({
          ...property,
          key: property.id,
          index: (pageNumber - 1) * pageSize + idx + 1,
          createdAt: customFormatDate(property.createdAt)
        }))
    : []

  useEffect(() => {
    if (search) {
      form.setFieldsValue({ search })
    }
  }, [form, search])

  useEffect(() => {
    if (sortBy) {
      const match = sortBy.match(/(.*?)(Asc|Desc)$/)
      if (match) {
        const [, field, order] = match
        setSortedInfo({
          field,
          order: order === 'Asc' ? 'ascend' : 'descend'
        })
      }
    }
  }, [sortBy])

  if (isError) {
    return <ErrorFetching />
  }

  return (
    <>
      <Flex align='center' justify='space-between' style={{ marginBottom: 12 }}>
        <Flex align='center'>
          <Typography.Title level={2} style={{ margin: 0 }}>
            Danh sách bài đăng
          </Typography.Title>
          <Divider type='vertical' style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Form form={form} name='searchCityForm' layout='inline'>
            <Form.Item name='search'>
              <Search
                allowClear
                onSearch={(value) => setFilters({ search: value })}
                placeholder='Tiêu đề, thành phố, quận huyện, địa chỉ..'
                style={{ width: 330 }}
              />
            </Form.Item>

            <Form.Item name='cityDisitrct'>
              <Cascader
                style={{ width: 250 }}
                options={cityDistrictOptions}
                onChange={handleCityDistrictChange}
                allowClear={false}
                loading={cityIsLoading || districtIsLoading}
                placeholder='Chọn quận huyện'
                suffixIcon={<GeoIcon />}
                defaultValue={
                  cityId && districtId
                    ? [cityId.toString(), districtId.toString()]
                    : cityId
                      ? [cityId.toString(), '0']
                      : []
                }
              />
            </Form.Item>

            <Form.Item name='roomType'>
              <Select
                style={{ width: 150 }}
                onChange={(value) => setFilters({ roomTypeId: parseInt(value) })}
                loading={roomTypeIsLoading}
                placeholder={'Loại phòng'}
                suffixIcon={<HomeIcon />}
                options={roomTypeOptions}
              />
            </Form.Item>
          </Form>
        </Flex>
      </Flex>

      <Tabs defaultActiveKey={PropertyStatus.PENDING} items={tabsItem} onChange={onTabChange} />

      <PropertyTable
        status={status}
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} bất động sản`,
          onShowSizeChange: (_, size) => setFilters({ pageSize: size }),
          onChange: (page) => setFilters({ pageNumber: page })
        }}
        handleTableChange={handleTableChange}
        sortedInfo={sortedInfo}
      />
    </>
  )
}

export default ListProperty
