
import { useParams } from 'react-router-dom';
import { Card, Spin, Typography, Image, Space } from 'antd';
import { usePropertyById } from '@/hooks/useProperties';
import DOMPurify from 'dompurify'

const { Title, Text } = Typography;

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = usePropertyById(Number(id));
  const descriptionCleanHTML = data ? DOMPurify.sanitize(data.description) : ''

  if (isLoading) return <Spin tip="Đang tải thông tin..." />;
  if (isError) return <div>Đã xảy ra lỗi khi tải thông tin bài đăng.</div>;
  if (!data) return <div>Bài đăng không tồn tại.</div>;

  return (
    <Card
      title={`Chi tiết bài đăng - ${data.title}`}
      style={{ width: '100%', maxWidth: '1200px', margin: '0 auto' }}
      bodyStyle={{ padding: '24px', backgroundColor: '#f9f9f9' }}
      headStyle={{ backgroundColor: '#fafafa', borderBottom: '1px solid #e8e8e8' }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {data.propertyImages.length > 0 ? (
          <Image.PreviewGroup>
            <div style={{ display: 'flex', overflowX: 'auto', marginBottom: '24px' }}>
              {data.propertyImages.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`Ảnh ${index + 1}`}
                  style={{ width: '300px', margin: '0 8px' }}
                />
              ))}
            </div>
          </Image.PreviewGroup>
        ) : (
          <Text>Không có hình ảnh</Text>
        )}
        
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={3}>Thông Tin Bài Đăng</Title>
          <div>
            <Text strong>Tiêu đề:</Text> <Text>{data.title}</Text>
          </div>
          <div>
            <Text strong>Vị trí:</Text> <Text>{data.location}</Text>
          </div>
          <Text strong>Mô tả:</Text>
          <div dangerouslySetInnerHTML={{ __html: descriptionCleanHTML }} />
          <div>
            <Text strong>Số phòng:</Text> <Text>{data.numRooms}</Text>
          </div>
          <div>
            <Text strong>Diện tích:</Text> <Text>{data.area} m²</Text>
          </div>
          <div>
            <Text strong>Quận/Huyện:</Text> <Text>{data.districtName}</Text>
          </div>
          <div>
            <Text strong>Thành phố:</Text> <Text>{data.cityName}</Text>
          </div>
          <div>
            <Text strong>Giá:</Text> <Text>{data.price} VND</Text>
          </div>
          <div>
            <Text strong>Ngày tạo:</Text> <Text>{data.createdAt}</Text>
          </div>
          <div>
            <Text strong>Loại phòng:</Text> <Text>{data.roomTypeName}</Text>
          </div>
          <div>
            <Text strong>Tiện ích:</Text> <Text>{data.amenities.join(', ')}</Text>
          </div>
          <div>
            <Text strong>Trạng thái:</Text> <Text>{data.status}</Text>
          </div>
          <div>
            <Text strong>Người dùng:</Text> <Text>{data.userName}</Text>
          </div>
          <div>
            <Text strong>Đã bị chặn:</Text> <Text>{data.blocked ? 'Có' : 'Không'}</Text>
          </div>
        </Space>
      </div>
    </Card>
  );
};

export default PropertyDetail;