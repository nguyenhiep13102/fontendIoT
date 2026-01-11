import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useSelector, useDispatch } from 'react-redux';
import { Image, Typography, Form, Input, message, Radio, Space ,Button, Select } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { EnvironmentTwoTone } from '@ant-design/icons';
import ButtonComponent from '../../components/Buttoncomponent/Buttoncomponent';
import { converPrice } from '../../utlis';
import env from '../../../env';
import utils from '../../utlis'
import  updateUsersevice  from '../../services/UserServices'
import { useQueryClient } from '@tanstack/react-query';
import { updateUser } from '../../redux/slides/userSide';
import OrderService from '../../services/OrderService';
import {removeOrderProduct} from '../../redux/slides/Oderslice.jsx'

const CheckoutPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { Text } = Typography;
  const location = useLocation();
  const { selectedItems = [] } = location.state || {};
  const orderItemsAll = useSelector((state) => state.Oder.orderItems);
  const selectedOrderItems = orderItemsAll.filter(item =>
    selectedItems.includes(item.Product)
  );
   const queryClient = useQueryClient();
  const user = useSelector((state) => state.user);
  const imageproduct = `${env.API_AV}`;
const { cities } = utils;
 console.log(selectedOrderItems)
  const price = selectedOrderItems.reduce((acc, item) => acc +item.price * (1-item.discount/100) * item.amount, 0);
  const vat = price * 0.1;
  
const delivery = useMemo(() => {
  if (price <= 200000){
     return 20000;
  
} else if(price<500000 && price >200000){
  return 10000;
} else {
    return 0; 
  }
}, [price]);

  const total = price + vat + delivery;

  // State cho form chỉnh sửa địa chỉ
  const [editingAddress, setEditingAddress] = useState(false);
  const [form] = Form.useForm();

  // State phương thức thanh toán
  const [paymentMethod, setPaymentMethod] = useState('');

  const handleEditAddress = () => {
    setEditingAddress(true);
    form.setFieldsValue({
      fullName: user?.name || '',
      phone: user?.phone || '',
      address: user?.addres || '',
      city: user?.city || '',
    });
    console.log(form);

  };

  const onFinishAddress = async (values) => {
    try {
         const payload = {
         name: values.fullName,
         phone: values.phone,
         addres: values.address,
          city: values.city,
       };

      const res = await updateUsersevice.updateUser(user._id, payload,user.access_token  );
      console.log(res)
      if (res?.status=='success') {
        setEditingAddress(false);
      message.success('Cập nhật địa chỉ thành công');
      queryClient.invalidateQueries(['creatUser']);
     dispatch(updateUser(
     {
      ...user,        
      ...res.user ,
     }
    ));
      
    } 
    } catch (error) {
      message.error('Cập nhật thất bại: ' + (error.message || ''));
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Validate Failed:', errorInfo);
  };

  const handleOrder = async () => {
    if (selectedOrderItems.length === 0) {
      message.error('Vui lòng chọn sản phẩm để thanh toán');
      return;
    }
    if (!user?.addres || !user?.city || !user?.phone) {
      message.error('Vui lòng cập nhật đầy đủ thông tin nhận hàng');
      handleEditAddress();
      return;
    }
    if (!paymentMethod) {
      message.error('Vui lòng chọn phương thức thanh toán');
      return;
    }

    const orderPayload = {
    oderItems: selectedOrderItems,
    shippingAddress: {
      fullName: user.name,
      adress: user.addres,
      city: user.city,
      phone: user.phone,
    },
    paymentMethod,
    itemsPrice: price,
    shippingPrice: delivery,
    taxiPrice: vat,
    totalPrice: total,
    user: user._id,
  };

   if (paymentMethod === 'online') {
    try {
      const res = await OrderService.CreactOrder(orderPayload, user.access_token);
      console.log('luu order thanh cong ',res.data)
      const payment = await OrderService.creatvnpay(res.data._id ,user.access_token);
      console.log('in ra duong link ',payment)
      
      if (payment) {
       window.location.href = payment;
      } else {
        message.error('Không tạo được link thanh toán');
      }
    } catch (err) {
      message.error('Thanh toán online thất bại: ' + err.message);
    }
    return; 
  }


  try {
    const res = await OrderService.CreactOrder(orderPayload, user.access_token);
    if(res.status=='success'){
        message.success('đăt hàng thành công ');
        selectedOrderItems.forEach(item => {
        dispatch(removeOrderProduct({
         orderItems: {
          Product: item.Product
    }
  }));
},);
navigate('/Order'); 
    }
    else if(res.status=='Err'){
        message.warning(res.message);
        navigate('/Order'); 
      }

    else{
       message.error("Đặt hàng thất bại: " + err.message);
    }
    
    // navigate('/OrderSuccess'); // hoặc nơi bạn muốn redirect
  } catch (err) {
    message.error("Đặt hàng thất bại: " + err.message);
  }
  };

  return (
    <Container>
      <Breadcrumb>
        <span onClick={() => navigate('/')}>Trang chủ</span> &gt;{' '}
        <span onClick={() => navigate('/Order')}>Giỏ hàng</span> &gt; Thanh toán
      </Breadcrumb>

      {/* Section Địa chỉ */}
      <Section>
        <SectionTitle>
          <EnvironmentTwoTone twoToneColor="#f5222d" style={{ marginRight: 8 }} />
          Địa Chỉ Nhận Hàng
        </SectionTitle>

        {editingAddress ? (
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinishAddress}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Họ tên"
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
               
              ]}
            >
              <Input placeholder="0987654321" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input placeholder="Số nhà, tên đường, phường/xã" />
            </Form.Item>
           
<Form.Item
  label="Thành phố"
  name="city"
  rules={[{ required: true, message: 'Vui lòng chọn thành phố' }]}
>
  <Select showSearch placeholder="Chọn thành phố">
    {cities?.map(city => (
      <Select.Option key={city} value={city}>
        {city}
      </Select.Option>
    ))}
  </Select>
</Form.Item>
            <FormButtons>
              <Button onClick={() => setEditingAddress(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Lưu địa chỉ
              </Button>
            </FormButtons>
          </Form>
        ) : (
          <>
            <TextInfo>
              <strong>Họ tên:</strong> {user?.name || 'Chưa đăng nhập'}{' '}
              <strong style={{ marginLeft: 24 }}>Số điện thoại:</strong>{' '}
              {user?.phone || 'Chưa có số điện thoại'}
            </TextInfo>
            <TextInfo>
              <strong>Địa chỉ:</strong> {user?.addres || 'Chưa có địa chỉ'}{' '}
              <strong style={{ marginLeft: 24 }}>Thành phố:</strong>{' '}
              {user?.city || 'Chưa có thành phố'}
            </TextInfo>
            {(!user?.addres || !user?.city || !user?.phone) && (
              <ButtonComponent
                textButton="Cập nhật địa chỉ"
                fontSize="14px"
                height="40px"
                bgColor="#1890ff"
                hoverBg="#40a9ff"
                borderRadius="4px"
                onClick={handleEditAddress}
                style={{ marginTop: 8 }}
              />
            )}
          </>
        )}
      </Section>

      {/* Section Sản phẩm */}
      <Section>
        <SectionTitle>Sản phẩm thanh toán</SectionTitle>
        {selectedOrderItems.map((item) => (
          <ProductItem key={item.Product}>
            <Image width={80} src={`${imageproduct}${item.image}`} />
            <ProductInfo>
              <Text strong>{item.name}</Text>
              <Text>Số lượng: {item.amount}</Text>
            </ProductInfo>
             <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ color: 'red', fontWeight: 'bold', fontSize: '16px' }}>
                {converPrice(((item.price * (1-item.discount/100)) * item.amount))}
              </div>
              <div style={{ textDecoration: 'line-through', color: '#888', fontSize: '14px' }}>
                {converPrice(item?.price* item.amount)}
              </div>
            </div>
          </ProductItem>
        ))}
      </Section>

      {/* Section Phương thức thanh toán */}
      <Section>
        <SectionTitle>Phương thức thanh toán</SectionTitle>
        <Radio.Group
          onChange={e => setPaymentMethod(e.target.value)}
          value={paymentMethod}
        >
          <Space direction="vertical">
            <Radio value="cod">Thanh toán khi nhận hàng (COD)</Radio>
            <Radio value="online">Thanh toán online qua cổng VNPay</Radio>
          </Space>
        </Radio.Group>
      </Section>

      {/* Section Đơn hàng */}
      <Section>
        <SectionTitle>Đơn hàng</SectionTitle>
        <SummaryItem>
          <span>Tạm tính:</span>
          <span>{converPrice(price)}</span>
        </SummaryItem>
        <SummaryItem>
          <span>Thuế VAT (10%):</span>
          <span>{converPrice(vat)}</span>
        </SummaryItem>
        <SummaryItem>
          <span>Phí giao hàng:</span>
          <span>{converPrice(delivery)}</span>
        </SummaryItem>
        <SummaryFooter>
          <TotalRow>
            <strong>Tổng thanh toán:</strong>
            <strong>{converPrice(total)}</strong>
          </TotalRow>
          <ButtonComponent
            textButton="Đặt hàng"
            fontSize="18px"
            height="52px"
            width="100%"
            padding="12px 32px"
            bgColor="#f5222d"
            hoverBg="#ad6b6d"
            borderRadius="8px"
            fontWeight="600"
            onClick={handleOrder}
          />
        </SummaryFooter>
      </Section>
    </Container>
  );
};

export default CheckoutPage;

// Styled Components

const Container = styled.div`
  padding: 24px;
  max-width: 1000px;
  margin: 0 auto;
`;

const Breadcrumb = styled.div`
  margin-bottom: 16px;
  font-size: 16px;
  cursor: pointer;
  span:hover {
    text-decoration: underline;
  }
`;

const Section = styled.div`
  margin-bottom: 32px;
  border: 1px solid #ddd;
  padding: 24px;
  border-radius: 8px;
`;

const SectionTitle = styled.h2`
  margin-bottom: 16px;
  font-size: 20px;
  font-weight: 600;
  color: #f5222d;
`;

const TextInfo = styled.p`
  margin-bottom: 8px;
  font-size: 16px;
`;

const ProductItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
`;

const ProductInfo = styled.div`
  flex: 1;
  margin-left: 16px;
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  font-size: 16px;
`;

const SummaryFooter = styled.div`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const TotalRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 600;
  margin-top: 12px;
  padding-top: 8px;
  border-top: 1px solid #ccc;
`;

const FormButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-top: 12px;
`;
