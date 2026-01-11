import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Breadcrumb, Card, Row, Col, Image, Typography, Tag, Divider, Space, Button, Empty, message } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import * as OrderService from '../../services/OrderService';
import { useQuery ,useQueryClient  } from '@tanstack/react-query';
import env from '../../../env';
import Loading from '../../components/LoadingComponent/loading';
import ButtonComponent from '../../components/Buttoncomponent/Buttoncomponent';
import   { statusLabels } from '../../utlis'
const { Text, Title } = Typography;

const Myorder = () => {
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();
  const imageBase = env.API_AV;
const queryClient = useQueryClient(); 
  const fetchMyOrder = async () => {
    if (!user?._id || !user?.access_token) return [];
    const res = await OrderService.getOrderdetail(user._id, user.access_token);
    return res.data;
  };
const handlecancelOrder = async (orderId) => {
  try {
    const confirmed = window.confirm('Bạn có chắc muốn huỷ đơn hàng này không?');
    if (!confirmed) return;

    const result = await OrderService.cancelOrder(orderId, user.access_token);

    if (result?.status === 'OK') {
      await queryClient.invalidateQueries(['userOrder', user?._id]); // ✅ Sử dụng được queryClient
      message.success(result.message || 'Xoá đơn hàng thành công!');
    } else {
      message.error(result?.message || 'Huỷ đơn thất bại.');
    }
  } catch (error) {
    console.error('Cancel order error:', error);
    message.error('Lỗi hệ thống khi huỷ đơn hàng.');
  }
};



  const { data: orders, isLoading } = useQuery({
    queryKey: ['userOrder', user?._id],
    queryFn: fetchMyOrder,
    enabled: !!user?._id,
  });
  console.log(orders)
 const handleDetailOrder =(id) =>{
  navigate(`/DetailsOrder/${id}`)
 }
  return (
    <PageContainer>
      <Loading isloading={isLoading}>
        {/* Breadcrumb */}
        <BreadcrumbContainer>
          <Breadcrumb>
            <Breadcrumb.Item>
              <span onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                <HomeOutlined /> <Text strong style={{ fontSize: 16 }}>Trang chủ</Text>
              </span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <Text style={{ fontSize: 14 }}>Đơn hàng của tôi</Text>
            </Breadcrumb.Item>
          </Breadcrumb>
        </BreadcrumbContainer>

        {/* Title */}
        <Title level={3} style={{ margin: '16px 0' }}>Đơn hàng của tôi</Title>

        {orders?.length > 0 ? (
          orders.map((order) => (
            <OrderCard key={order._id}>
       
              <Card
                title={<Text strong>Mã đơn hàng: {order._id}</Text>}
                size="small"
                extra={
                  <Space size="middle">
                  
                    <Tag color={order.isPaid ? 'green' : 'red'}>
                      {order.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </Tag>
                    {/* <Tag color={order.isDelivered ? 'green' : 'red'}>
                      {order.isDelivered ? 'Đã giao hàng' : 'Chưa giao hàng'}
                    </Tag>    */}
                    <Tag color="green">
                     {statusLabels[order.status] || 'Không xác định'}
                   </Tag>
                  </Space>
                }
                style={{ width: '100%' }}
              >
               
                {order.createdAt && (
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Ngày tạo: {new Date(order.createdAt).toLocaleString('vi-VN')}
                  </Text>
                )}
                <Divider />

               
                <div>
                  {order.oderItems.map((item, idx) => (
                    <Row key={idx} align="middle" gutter={[16, 16]} style={{ marginBottom: 8 }}>
                      <Col xs={6} sm={4} md={3} lg={2}>
                        <Image
                          width={60}
                          height={60}
                          src={`${imageBase}${item.image}`}
                          preview={true}
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
                </div>

                <Divider />

                
                <Row justify="space-between" align="middle">
                  <Col>
                    <Text strong>Tổng tiền: </Text>
                    <Text type="danger">{order.totalPrice.toLocaleString()}₫</Text>
                  </Col>
                  <Col>
                    <Space>
                      
                      {order.isDelivered ? (
  <ButtonComponent
    textButton="Đã giao"
    bgColor="#52c41a"
    style={{ minWidth: 100, cursor: 'not-allowed' }}
    disabled
  />
) : (
  <ButtonComponent
    textButton="Hủy đơn"
    bgColor={order.status === 'shipping' ? '#aaa' : 'red'}
    onClick={() => {
      if (order.status === 'shipping') {
        message.warning('Không thể huỷ đơn khi đang giao hàng!');
      } else {
        handlecancelOrder(order._id);
      }
    }}
    style={{ minWidth: 100, cursor: order.status === 'shipping' ? 'not-allowed' : 'pointer' }}
  />
)}
                      <ButtonComponent
                        textButton="Xem chi tiết"
                        onClick={() => handleDetailOrder(order._id)}
                        style={{ minWidth: 100 }}
                      />
                    </Space>
                  </Col>
                </Row>
              </Card>
            </OrderCard>
          ))
        ) : (
          <Empty description="Bạn chưa có đơn hàng nào." style={{ marginTop: 40 }} />
        )}

        {/* Back Home */}
        <BackHome onClick={() => navigate('/')}>&larr; Quay về trang chủ</BackHome>
      </Loading>
    </PageContainer>
  );
};

export default Myorder;

// Styled-components
const PageContainer = styled.div`
  background: #f9f9f9;
  padding: 24px;
  max-width: 1000px;
  margin: 40px auto;
`;

const BreadcrumbContainer = styled.div`
  background: white;
  padding: 12px 16px;
  border-radius: 4px;
  margin-bottom: 16px;
`;

const OrderCard = styled.div`
  margin-bottom: 24px;
`;

const BackHome = styled.div`
  margin-top: 24px;
  color: #1890ff;
  cursor: pointer;
  text-align: center;
  font-weight: bold;
`;
