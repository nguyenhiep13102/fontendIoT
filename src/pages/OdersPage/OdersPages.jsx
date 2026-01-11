import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Button, Image, Typography, InputNumber, Checkbox, Space, message, Steps } from 'antd';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import  ButtonComponent from '../../components/Buttoncomponent/Buttoncomponent.jsx'
import {decreaseAmount,increaseAmount,removeOrderProduct} from '../../redux/slides/Oderslice.jsx'
import env from '../../../env';
import Stepcomponent from '../../components/Step/Stepcomponent.jsx'
import { converPrice } from '../../utlis.js';
const OdersPages = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
const [selectedItems, setSelectedItems] = useState([]);
  const { Text } = Typography;
  const orderItems = useSelector((state) => state.Oder.orderItems);
   const orderItems2 = useSelector((state) => state.Oder);
  console.log('orderItems',orderItems2)
 const   imageproduct = `${env.API_AV}`;
 console.log(selectedItems);
const itemsPrice = orderItems.reduce((total, item) => {
  return total + item.price * item.amount;
}, 0);
 const user = useSelector((state) => state.user)
 console.log('user',user)
const selectedOrderItems = useMemo(() => {
  return orderItems.filter(item => selectedItems.includes(item.Product));
}, [orderItems, selectedItems]);

const handleCheckout = () => {
  if (!selectedItems || selectedItems.length === 0) {
    message.error('Vui lòng chọn sản phẩm để thanh toán');
    return;
  }
  navigate('/checkout', { state: { selectedItems } });
};
const priceMemo = useMemo(() => {
  const result = selectedOrderItems.reduce((total, item) => {
    return total + item.price * (1-item.discount/100) * item.amount;
  }, 0);
  return Number(result) || 0;
}, [selectedOrderItems]);

const diliveryPriceMemo = useMemo(() => {
  if (priceMemo <= 200000){
     return 20000;
  
} else if(priceMemo<500000 && priceMemo >200000){
  return 10000;
} else if (priceMemo> 500000) {
  return 0
} 
}, [priceMemo]);

const VATPrice = useMemo(() => {
  return priceMemo * 0.1;
}, [priceMemo]);

const totalPriceMemo = useMemo(() => {
  return priceMemo + diliveryPriceMemo + VATPrice;
}, [priceMemo, diliveryPriceMemo, VATPrice]);

const currentStep = useMemo(() => {
  if (priceMemo > 500000) {
    return 2; // miễn phí
  } else if (priceMemo >= 200000) {
    return 1; // 10.000 VND
  } else if (priceMemo > 0) {
    return 0; // 20.000 VND
  }
  return 0;
}, [priceMemo]);

const items=[
      {
        title: '20.000 VND',
        description: 'dưới 200.000 VND',
      },
      {
        title: '10.000 VND',
        description: 'từ 200.000 VND đến dưới 500.000 VND',
       
      },
      {
        title: '0 VND',
        description: 'trên 500.000 VND',
      },
    ];
  return (
    <PageContainer>
      <Breadcrumb>
        <span onClick={() => navigate('/')}>Trang chủ</span> &gt; Giỏ hàng
      </Breadcrumb>
    
      <ContentWrapper>
     

        <ProductList>
              <Stepcomponent
    current={currentStep}
    items={items}
    
  />
          <CartHeader>
         
          <Checkbox
    checked={selectedItems.length === orderItems.length && orderItems.length > 0}
    indeterminate={selectedItems.length > 0 && selectedItems.length < orderItems.length}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedItems(orderItems.map((item) => item.Product));
      } else {
        setSelectedItems([]);
      }
    }}
    style={{ width: '200px' }}
  >
    Chọn tất cả
  </Checkbox>
        <HeaderText>Sản phẩm</HeaderText>
        <HeaderText>Đơn giá</HeaderText>
        <HeaderText>Số lượng</HeaderText>
        <HeaderText>Thành tiền</HeaderText>
        <HeaderText>Thao tác</HeaderText>
      </CartHeader>


         {orderItems.map((item) => (

        <CartItem key={`${item.Product}`}>
          <Checkbox
    checked={selectedItems.includes(item.Product)}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedItems([...selectedItems, item.Product]);
      } else {
        setSelectedItems(selectedItems.filter(id => id !== item.Product));
      }
    }}
  />
          <ProductInfo>
            <Image width={80} src={`${imageproduct}${item.image}`} />
            <ProductDetails>
              <Text strong>{item.name}</Text>
              <br />
              <Text type="secondary">đang giảm giá {item.discount}%</Text>
            </ProductDetails>
          </ProductInfo>
         <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
  <div style={{ color: 'red', fontWeight: 'bold', fontSize: '16px' }}>
    {converPrice((item.price * (1-item.discount/100)))}
  </div>
  <div style={{ textDecoration: 'line-through', color: '#888', fontSize: '14px' }}>
    {converPrice(item?.price)}
  </div>
</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
  <ButtonComponent
  icon={<MinusOutlined />}
  onClick={() => dispatch(decreaseAmount({ orderItems: item }))}
/>
  <InputNumber
    min={1}
    value={item.amount} 
    readOnly
    style={{ width: '50px', textAlign: 'center' }}
    controls={false}
  />
 <ButtonComponent
  icon={<PlusOutlined  />}
  onClick={() => dispatch(increaseAmount({ orderItems: item }))}
/>
</div>
          <TotalPrice>{converPrice(((item.price * (1-item.discount/100)) * item.amount))} </TotalPrice>
          <ButtonComponent
  icon={<DeleteOutlined />}
  onClick={() => dispatch(removeOrderProduct({ orderItems: item }))}
/>
        </CartItem>
      ))}
        </ProductList>

        <OrderSummary>
          <SummaryTitle>Thông tin đơn hàng</SummaryTitle>
          <SummaryRow>
            <span>Tạm tính</span>
            <span>{converPrice(priceMemo)}</span>
          </SummaryRow>
          {/* <SummaryRow>
            <span>Giảm giá</span>
            <span>0₫</span>
          </SummaryRow> */}
          <SummaryRow>
            <span>Thuế(10%)</span>
            <span>{converPrice(VATPrice)}</span>
          </SummaryRow>
          <SummaryRow>
            <span>Phí giao hàng</span>
            <span>{converPrice(diliveryPriceMemo)}</span>
          </SummaryRow>
          <SummaryTotal>
            <strong>Tổng tiền</strong>
            <strong>{converPrice(totalPriceMemo)}</strong>
          </SummaryTotal>
          <VatNote>* Đã bao gồm VAT nếu có</VatNote>
          <ButtonComponent
  textButton="Mua Hàng"
  fontSize="18px"
  height="52px"
  width="100%"
  padding="12px 32px"
  bgColor="#f5222d"
  hoverBg="#ad6b6d"
  borderRadius="8px"
  fontWeight="600"
  onClick ={handleCheckout}
/>
        </OrderSummary>
      </ContentWrapper>
    </PageContainer>
  );
};

export default OdersPages;

// Styled Components


const PageContainer = styled.div`
  background: #f5f5f5;
  padding: 24px;
  min-height: 100vh;
`;

const ContentWrapper = styled.div`
  display: flex;
  gap: 24px;
`;

const ProductList = styled.div`
  flex: 3;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;
const Breadcrumb = styled.div`
  font-size: 15px;
  margin-bottom: 16px;
  span {
    font-weight: 500;
    color: #1890ff;
    cursor: pointer;
  }
`;






const Info = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;





const OrderSummary = styled.div`
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const SummaryTitle = styled.h3`
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 24px;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
  font-size: 15px;
`;

const SummaryTotal = styled(SummaryRow)`
  font-weight: bold;
  border-top: 1px dashed #ddd;
  padding-top: 16px;
`;

const VatNote = styled.div`
  font-size: 13px;
  color: #888;
  margin: 16px 0;
`;

const BuyButton = styled(Button)`
  height: 42px;
  font-size: 16px;
  font-weight: 500;
  background-color: #f5222d;
  border: none;
`;
const Container = styled.div`
  background: #fff;
  padding: 24px;
  max-width: 1200px;
  margin: 40px auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const CartHeader = styled.div`
  display: grid;
  grid-template-columns: 40px 3fr 1fr 1fr 1fr 60px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #eee;
  font-weight: bold;
`;

const HeaderText = styled.div`
  text-align: center;
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 40px 3fr 1fr 1fr 1fr 60px;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid #f0f0f0;
`;

const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProductDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const Price = styled.div`
  text-align: center;
  color: #0f0e0e;
`;

const TotalPrice = styled(Price)`
  font-weight: bold;
   text-align: center;
   color : #f02121 ;
`;

const Footer = styled.div`
  text-align: right;
  margin-top: 24px;
`;
