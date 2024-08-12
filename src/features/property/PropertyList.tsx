import { Button, Divider, Flex, Input, Space, TableProps, Tabs, TabsProps, Typography } from 'antd';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Property as PropertyType, PropertyDataSource } from '@/models/property.type';
import { useProperty } from '@/hooks/useProperties';
import PropertyTable from './PropertyTable';
import ErrorFetching from '@/components/ErrorFetching';
import { customFormatDate } from '@/utils/customFormatDate';
import { PlusCircleOutlined } from '@ant-design/icons';

const { Search } = Input;

const tabsItem: TabsProps['items'] = [
  { key: 'APPROVED', label: 'Đã Duyệt' },
  { key: 'PENDING', label: 'Chờ Duyệt' },
  { key: 'REJECTED', label: 'Đã Từ Chối' },
  
];

function PropertyList() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [roomType, setRoomType] = useState('');
  const [numOfDay, setNumOfDay] = useState(1);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000000);
  const [minArea, setMinArea] = useState(5);
  const [maxArea, setMaxArea] = useState(10);
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('IdDesc');
  const [status, setStatus] = useState('ALL');

  const { data, isLoading, isError } = useProperty(
    search, roomType, numOfDay, minPrice, maxPrice, minArea, maxArea, district, city, pageNumber, pageSize, sortBy
  );

  const onTabChange = (key: string) => {
    setStatus(key);
    queryClient.invalidateQueries({ queryKey: ['properties'] }); // Sửa đổi ở đây
  };

  const handleTableChange: TableProps<PropertyDataSource>['onChange'] = (_, filters, sorter) => {
    if (Array.isArray(sorter)) {
      setSortBy('createdAtDesc');
    } else {
      if (sorter.order) {
        const order = sorter.order === 'ascend' ? 'Asc' : 'Desc';
        setSortBy(`${sorter.field}${order}`);
      }
    }
  };

  const dataSource: PropertyDataSource[] = data
    ? data.data.map((property: PropertyType) => ({
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

        <Space>
          <Button icon={<PlusCircleOutlined />} shape="round" type="primary" onClick={() => navigate('/property/add')}>
            Thêm mới
          </Button>
        </Space>
      </Flex>

      <Tabs defaultActiveKey="ALL" items={tabsItem} onChange={onTabChange} />

      <PropertyTable
        dataSource={dataSource}
        loading={isLoading}
        paginationProps={{
          total: data?.pageInfo.totalElements,
          pageSize: pageSize,
          current: pageNumber,
          showTotal: (total, range) => `${range[0]}-${range[1]} trong ${total} bất động sản`,
          onShowSizeChange: (_, size) => setPageSize(size),
          onChange: (page) => setPageNumber(page),
        }}
        handleTableChange={handleTableChange}
      />
    </>
  );
}

export default PropertyList;