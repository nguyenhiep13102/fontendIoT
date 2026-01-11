

import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Breadcrumb,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Empty,
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import * as MyIoTService from '../../services/IoTServices';
import Loading from '../../components/LoadingComponent/loading';

const { Text, Title } = Typography;

const ListFanIoT = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const fetchMyIoT = async () => {
    if (!user?._id || !user?.access_token) return [];
    const res = await MyIoTService.getMyIoT(user._id, user.access_token);
    return res.data;
  };

  const { data: myIoTList, isLoading } = useQuery({
    queryKey: ['my-iot', user?._id],
    queryFn: fetchMyIoT,
    enabled: !!user?._id,
  });

  return (
    <PageContainer>
      <Loading isloading={isLoading}>
        {/* Breadcrumb */}
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate('/')}>
            <HomeOutlined /> Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item>Thiết bị IoT của tôi</Breadcrumb.Item>
        </Breadcrumb>

        <Title level={3} style={{ margin: '16px 0' }}>
          Danh sách thiết bị IoT
        </Title>

        {myIoTList?.length > 0 ? (
          <Space direction="vertical" style={{ width: '100%' }} size={16}>
            {myIoTList.map((fan) => (
              <Card
                key={fan._id}
                title={<Text strong>{fan.name}</Text>}
                extra={
                  <Tag color={fan.status === 'ON' ? 'green' : 'red'}>
                    {fan.status}
                  </Tag>
                }
              >
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text type="secondary">Mã thiết bị:</Text>{' '}
                    <Text>{fan.FAN_ID}</Text>
                  </Col>

                  <Col span={12}>
                    <Text type="secondary">Loại:</Text>{' '}
                    <Text>{fan.IdType}</Text>
                  </Col>

                  <Col span={12}>
                    <Text type="secondary">Nhiệt độ:</Text>{' '}
                    <Text>{fan.TemperatureSensor}°C</Text>
                  </Col>

                  <Col span={12}>
                    <Text type="secondary">Ngưỡng:</Text>{' '}
                    <Text>{fan.Thresholdvalue}°C</Text>
                  </Col>

                  <Col span={12}>
                    <Text type="secondary">Tốc độ:</Text>{' '}
                    <Text>{fan.Speed}</Text>
                  </Col>

                  <Col span={12}>
                    <Text type="secondary">Cập nhật:</Text>{' '}
                    <Text>
                      {new Date(fan.updatedAt).toLocaleString('vi-VN')}
                    </Text>
                  </Col>
                </Row>

      

                <Space>
                  <Button
                    type="primary"
                    onClick={() => navigate(`/iot/${fan._id}`)}
                  >
                    Xem chi tiết
                  </Button>

                  <Button
                    onClick={() => navigate(`/RemodeFan/${fan._id}`)}
                  >
                    Điều khiển khẩn cấp
                  </Button>

                  <Button
                    onClick={() => navigate(`/FanBarChart`)}
                  >
                    biểu đồ hoạt động 

                  </Button> 

                </Space>
              </Card>
            ))}
          </Space>
        ) : (
          <Empty description="Bạn chưa có thiết bị IoT nào" />
        )}
      </Loading>
    </PageContainer>
  );
};

export default ListFanIoT;



const PageContainer = styled.div`
  background: #f9f9f9;
  padding: 24px;
  max-width: 1000px;
  margin: 40px auto;
`;
 