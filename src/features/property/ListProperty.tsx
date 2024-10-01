import { useQueryClient } from '@tanstack/react-query'
import { Cascader, Divider, Flex, Form, Input, Select, TableProps, Tabs, TabsProps, Typography } from 'antd'

import ErrorFetching from '@/components/ErrorFetching'
import { DollarIcon, GeoIcon, HomeIcon } from '@/components/FilterIcons.tsx'
import { useCitiesAll } from '@/hooks/useCities.ts'
import { useCustomDateFormatter } from '@/hooks/useCustomDateFormatter.ts'
import { useDistrictsAll } from '@/hooks/useDistricts.ts'
import { useProperties, usePropertyFilters } from '@/hooks/useProperties'
import { useRoomTypesAll } from '@/hooks/useRoomTypes.ts'
import { PropertyDataSource, PropertyStatus, Property as PropertyType } from '@/types/property.type'
import { CheckCircleOutlined, CloseSquareOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import PropertyTable from './PropertyTable'

const { Search } = Input

const milion = 1000000

interface Option {
  value: string
  label: string
  children?: Option[]
}

type OnChange = NonNullable<TableProps<PropertyDataSource>['onChange']>
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

function ListProperty() {
  const [form] = Form.useForm()
  const queryClient = useQueryClient()
  const { t } = useTranslation(['common', 'property'])
  const tabsItem: TabsProps['items'] = [
    { key: PropertyStatus.PENDING, label: t('property:tab.pending'), icon: <ExclamationCircleOutlined /> },
    { key: PropertyStatus.APPROVED, label: t('property:tab.approved'), icon: <CheckCircleOutlined /> },
    { key: PropertyStatus.REJECTED, label: t('property:tab.rejected'), icon: <CloseSquareOutlined /> }
  ]

  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const {
    search,
    cityId,
    districtId,
    roomTypeId,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    numOfDays,
    status,
    pageNumber,
    pageSize,
    sortBy,
    setFilters
  } = usePropertyFilters()

  const { data, isLoading, isError } = useProperties(
    search,
    cityId,
    districtId,
    roomTypeId,
    minPrice,
    maxPrice,
    minArea,
    maxArea,
    numOfDays,
    status,
    pageNumber,
    pageSize,
    sortBy
  )

  // Start City and District
  const { cityData, cityIsLoading } = useCitiesAll()
  const { districtData, districtIsLoading } = useDistrictsAll()
  const formatDate = useCustomDateFormatter()
  const cityDistrictOptions: Option[] = [{ value: '0', label: t('property:filter.nationwide') }]
  if (cityData && districtData) {
    const cityMap = cityData.map((city) => ({
      value: city.id.toString(),
      label: city.name,
      children: [
        { value: '0', label: t('property:filter.all') },
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
  const roomTypeOptions: Option[] = [{ value: '0', label: t('property:filter.all') }]
  if (roomTypeData) {
    roomTypeOptions.push(
      ...roomTypeData.map((roomType) => ({
        value: roomType.id.toString(),
        label: roomType.name
      }))
    )
  }
  // End Room Type

  // Start Filter
  const handlePriceChange = (value: string) => {
    const [min, max] = value.split(',')
    setFilters({
      minPrice: Number(min || '0') * milion,
      maxPrice: Number(max || '0') * milion
    })
  }
  const handleAreaChange = (value: string) => {
    const [minArea, maxArea] = value.split(',')

    setFilters({
      minArea: parseInt(minArea) * 10,
      maxArea: parseInt(maxArea) * 10
    })
  }

  const onTabChange = (key: string) => {
    setFilters({ status: key as PropertyType['status'] })
    queryClient.invalidateQueries({ queryKey: ['properties'] })
  }

  // End Filter
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
          createdAt: formatDate(property.createdAt)
        }))
    : []

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
            {t('property:title')}
          </Typography.Title>
          <Divider type='vertical' style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Form
            form={form}
            name='searchCityForm'
            initialValues={{
              search: search,
              cityDistrict:
                cityId && districtId
                  ? [cityId.toString(), districtId.toString()]
                  : cityId
                    ? [cityId.toString(), '0']
                    : [],
              roomType: roomTypeId ? roomTypeId.toString() : undefined,
              price: minPrice || maxPrice ? `${minPrice / milion},${maxPrice / milion}` : undefined,
              area: minArea || maxArea ? `${minArea / 10},${maxArea / 10}` : undefined
            }}
            layout='inline'
          >
            <Form.Item name='search'>
              <Search
                allowClear
                className='w-72'
                onSearch={(value) => setFilters({ search: value })}
                placeholder={t('property:filter.searchPlaceholder')}
              />
            </Form.Item>

            <Form.Item name='cityDistrict'>
              <Cascader
                className='w-48'
                options={cityDistrictOptions}
                onChange={handleCityDistrictChange}
                allowClear={false}
                loading={cityIsLoading || districtIsLoading}
                placeholder={t('property:filter.selectDistrict')}
                suffixIcon={<GeoIcon />}
              />
            </Form.Item>

            <Form.Item name='roomType'>
              <Select
                className='w-48'
                onChange={(value) => setFilters({ roomTypeId: parseInt(value) })}
                loading={roomTypeIsLoading}
                placeholder={t('property:filter.roomType')}
                suffixIcon={<HomeIcon />}
                options={roomTypeOptions}
              />
            </Form.Item>
            <Form.Item name='price'>
              <Select
                className='w-48'
                onChange={handlePriceChange}
                placeholder={t('property:filter.price.title')}
                suffixIcon={<DollarIcon />}
                options={[
                  { value: '0,0', label: t('property:filter.all') },
                  { value: '0,3', label: t('property:filter.price.priceRangeLow') },
                  { value: '3,7', label: t('property:filter.price.priceRangeMediumLow') },
                  { value: '7,10', label: t('property:filter.price.priceRangeMediumHigh') },
                  { value: '10,0', label: t('property:filter.price.priceRangeHigh') }
                ]}
              />
            </Form.Item>
            <Form.Item name='area'>
              <Select
                className='w-48'
                onChange={handleAreaChange}
                placeholder={t('property:filter.area')}
                suffixIcon={<HomeIcon />}
                options={[
                  { value: '0,0', label: t('property:filter.all') },
                  { value: '0,3', label: '< 30 m2' },
                  { value: '3,5', label: '30 - 50 m2' },
                  { value: '5,7', label: '50 - 70 m2' },
                  { value: '7,10', label: '70 - 100 m2' },
                  { value: '10,0', label: '> 100 m2' }
                ]}
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
          showTotal: (total, range) => (
            <Trans
              ns={'property'}
              i18nKey='pagination.showTotal'
              values={{ total, rangeStart: range[0], rangeEnd: range[1] }}
            />
          ),
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
