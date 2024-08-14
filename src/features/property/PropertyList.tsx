import { Divider, Flex, Input,  TableProps, Tabs, TabsProps, Typography } from 'antd';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { Property as PropertyType, PropertyDataSource } from '@/models/property.type';
import { useProperty } from '@/hooks/useProperties';
import PropertyTable from './PropertyTable';
import ErrorFetching from '@/components/ErrorFetching';
import { customFormatDate } from '@/utils/customFormatDate';

const { Search } = Input;

const tabsItem: TabsProps['items'] = [
  { key: 'RESOLVED', label: 'Đã Duyệt' },
  { key: 'PENDING', label: 'Chờ Duyệt' },
  { key: 'REJECTED', label: 'Đã Từ Chối' },
];

function PropertyList() {
  const queryClient = useQueryClient();

  const [roomTypeId, setRoomTypeId] = useState(0);
  const [numOfDay, setNumOfDay] = useState(0);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [minArea, setMinArea] = useState(5);
  const [maxArea, setMaxArea] = useState(0);
  const [cityId, setCityId] = useState(0);
  const [districtId, setDistrictId] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('IdDesc');
  const [status, setStatus] = useState('RESOLVED');

  const { data, isLoading, isError } = useProperty(
    search, roomTypeId, numOfDay, minPrice, maxPrice, minArea, maxArea, districtId, cityId, pageNumber, pageSize, sortBy , status
  );

  const onTabChange = (key: string) => {
    setStatus(key);
    queryClient.invalidateQueries({ queryKey: ['properties'] }); 
  };

  const handleTableChange: TableProps<PropertyDataSource>['onChange'] = (_, filters, sorter) => {
    if (Array.isArray(sorter)) {
      setSortBy('idDesc'); 
    } else {
      if (sorter.order) {
        const order = sorter.order === 'ascend' ? 'Asc' : 'Desc';
        setSortBy(`${sorter.field}${order}`);
      }
      if (filters.roomType) {
        const result = filters.roomType
        setRoomTypeId(Number(result));
      } else {
        setRoomTypeId(0);
      }
    
      if (filters.numOfDay) {
        const result = filters.numOfDay;
        setNumOfDay(Number(result));
      } else {
        setNumOfDay(0);
      }
    
      if (filters.minPrice) {
        const result = filters.minPrice;
        setMinPrice(Number(result)); 
      } else {
        setMinPrice(0);
      }
    
      if (filters.maxPrice) {
        const result = filters.maxPrice;
        setMaxPrice(Number(result)); 
      } else {
        setMaxPrice(0);
      }
    
      if (filters.minArea) {
        const result = filters.minArea;
        setMinArea(Number(result));
      } else {
        setMinArea(0);
      }
    
      if (filters.maxArea) {
        const result = filters.maxArea;
        setMaxArea(Number(result));
      } else {
        setMaxArea(0);
      }
    
      if (filters.city) {
        const result = filters.city;
        setCityId(Number(result));
      } else {
        setCityId(0);
      }
    
      if (filters.district) {
        const result = filters.district;
        setDistrictId(Number(result));
      } else {
        setDistrictId(0);
      }
    }
  };

  const dataSource: PropertyDataSource[] = data
    ? data.data
        .filter((property: PropertyType) => property.status === status)
        .map((property: PropertyType) => ({
          key: property.id,
          id: property.id,
          title: property.title,
          description: property.description,
          location: property.location,
          numRooms: property.numRooms,
          area: property.area,
          districtId: property.districtId,
          districtName: property.districtName,
          userName: property.userName,
          userId: property.userId,
          cityId: property.cityId,
          cityName: property.cityName,
          amenities: property.amenities,
          price: property.price,
          propertyImages: property.propertyImages,
          status: property.status,
          blocked: property.blocked,
          roomTypeId: property.roomTypeId,
          roomTypeName: property.roomTypeName,
          createdAt: customFormatDate(property.createdAt)
        }))
    : [];


  if (isError) {
    return <ErrorFetching />;
  }

  return (
    <>
    
      <Flex align="center" justify="space-between" style={{ marginBottom: 12 }}>
        <Flex align="center">
          <Typography.Title level={2} style={{ margin: 0 }}>Danh sách bài đăng</Typography.Title>
          <Divider type="vertical" style={{ height: 40, backgroundColor: '#9a9a9b', margin: '0 16px' }} />
          <Search 
            allowClear 
            onSearch={(value) => setSearch(value)} 
            placeholder="Tìm kiếm theo tiêu đề" 
            style={{ width: 250 }} 
          />
        </Flex>

       
      </Flex>
        

      <Tabs defaultActiveKey="RESOLVED" items={tabsItem} onChange={onTabChange} />

      <PropertyTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} bài đăng`,
          onShowSizeChange: (_, size) => setPageSize(size),
          onChange: (page) => setPageNumber(page),
        }}
        handleTableChange={handleTableChange}
      />
    </>
  );
}

export default PropertyList;