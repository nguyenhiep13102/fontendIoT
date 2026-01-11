import React from 'react';
import styled from 'styled-components';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Breadcrumb,
  Typography,
  Tag,
  Divider,
  Row,
  Col,
  Image,
  Space,
  Empty,
  Descriptions,
} from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import * as OrderService from '../../services/OrderService';
import env from '../../../env';
import Loading from '../../components/LoadingComponent/loading';

const { Title, Text } = Typography;

const DetailOrderId = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const imageBase = env.API_AV;

  const fetchOrderDetail = async () => {
    if (!user?._id || !user?.access_token || !id) return null;
    const res = await OrderService.getOrderById(id, user.access_token);
    return res.data;
  };

  const { data: order, isLoading } = useQuery({
    queryKey: ['orderDetail', id],
    queryFn: fetchOrderDetail,
    enabled: !!user?._id && !!id,
  });
console.log(order)
  return (
    <Container>
      <Loading isloading={isLoading}>
        <BreadcrumbContainer>
          <Breadcrumb>
            <Breadcrumb.Item>
              <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <HomeOutlined /> <Text strong>Trang chủ</Text>
              </span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span onClick={() => navigate('/my-order')} style={{ cursor: 'pointer' }}>
                Đơn hàng của tôi
              </span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Chi tiết đơn hàng</Breadcrumb.Item>
          </Breadcrumb>
        </BreadcrumbContainer>

        <Title level={3}>Chi tiết đơn hàng</Title>

        {!order ? (
          <Empty description="Không tìm thấy đơn hàng." style={{ marginTop: 40 }} />
        ) : (
          <OrderDetailCard>
            <Row justify="space-between">
              <Col>
                <Text strong>Mã đơn hàng: </Text>
                <Text>{order._id}</Text>
              </Col>
              <Col>
                <Space>
                  <Tag color={order.isPaid ? 'green' : 'red'}>
                    {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                  </Tag>
                  <Tag color={order.isDelivered ? 'green' : 'red'}>
                    {order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}
                  </Tag>
                </Space>
              </Col>
            </Row>

            <Divider />

            <Row>
              <Col span={24}>
                <Text strong>Ngày tạo:</Text>{' '}
                <Text>{new Date(order.createdAt).toLocaleString('vi-VN')}</Text>
              </Col>
            </Row>

            <Divider />

            <Title level={5}>Sản phẩm:</Title>
            {order.oderItems.map((item, idx) => (
              <Row key={idx} align="middle" gutter={[16, 16]} style={{ marginBottom: 8 }}>
                <Col xs={6} sm={4} md={3} lg={2}>
                  <Image
                    width={60}
                    height={60}
                    src={`${imageBase}${item.image}`}
                    style={{ objectFit: 'cover', borderRadius: 4 }}
                    fallback=""
                  />
                </Col>
                <Col xs={18} sm={20} md={21} lg={22}>
                  <Row justify="space-between">
                    <Col>
                      <Text strong>{item.name}</Text>
                    </Col>
                    <Col>
                      <Text>Số lượng: {item.amount}</Text>
                    </Col>
                  </Row>
                </Col>
              </Row>
            ))}

            <Divider />

            <Row justify="space-between">
              <Col>
                <Text strong>Phương thức thanh toán:</Text>{' '}
                <Text>
                {order.paymentMethod === 'cod'
                ? 'Thanh toán khi nhận hàng'
                : order.paymentMethod === 'online'
                ? 'Thanh toán qua PayPal'
                : 'Thanh toán online'}
              </Text>
                
              </Col>
              <Col>
                <Text strong>Tổng tiền: </Text>
                <Text type="danger">{order.totalPrice.toLocaleString()}₫</Text>
              </Col>
            </Row>

            <Divider />

            <Descriptions title="Địa chỉ giao hàng" bordered column={1}>
              <Descriptions.Item label="Người nhận">
                {order.shippingAddress.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {order.shippingAddress.adress}, {order.shippingAddress.city}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {order.shippingAddress.phone}
              </Descriptions.Item>
            </Descriptions>
          </OrderDetailCard>
        )}

        <BackHome onClick={() => navigate('/my-order')}>&larr; Quay lại đơn hàng</BackHome>
      </Loading>
    </Container>
  );
};

export default DetailOrderId;

// Styled-components
const Container = styled.div`
  background: #f9f9f9;
  padding: 24px;
  max-width: 900px;
  margin: 40px auto;
`;

const BreadcrumbContainer = styled.div`
  background: white;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const OrderDetailCard = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
`;

const BackHome = styled.div`
  margin-top: 24px;
  color: #1890ff;
  cursor: pointer;
  text-align: center;
  font-weight: bold;
`;
