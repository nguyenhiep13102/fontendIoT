/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { Col, Image, InputNumber, message, Row } from 'antd';
import styled from 'styled-components';
import {
  StarFilled,
  PlusOutlined,
  MinusOutlined,
  StarOutlined
} from '@ant-design/icons';
import ButtonComponent from '../Buttoncomponent/Buttoncomponent';
import ProductService from '../../services/ProductService'
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import env from '../../../env'
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addOrderProduct } from '../../redux/slides/Oderslice'
import { converPrice } from '../../utlis';
export const ProductDetailComponent = ({isProduct}) => {
    const { id } = useParams();
     const [numProduct , setnumProduct] = useState(1);
     const user = useSelector((state) => state.user)
     console.log(user)
    const navigate = useNavigate();
    const location = useLocation(); 
    const dispatch = useDispatch();
    

  // kiểm tra   có id hay không
  if (!id) {
    return <div>Không có ID sản phẩm!</div>;
  }
console.log('location ' , location.pathname);
  const fetchGetDetailsProduct = async (productId) => {
    const res = await ProductService.getProductDetail(productId);
     if (res.status === 'error') {
     throw new Error(res.message || 'Lỗi không xác định từ server');
  }
    return res;
  };

  const { isLoading, data: productDetail, error } = useQuery(
    ['product-detail', id],
    ({ queryKey }) => fetchGetDetailsProduct(queryKey[1]),
    {
      enabled: !!id, 
       retry: false,
    }
  );
  console.log(productDetail);
const   imageproduct = `${env.API_AV}${productDetail?.image}`;

  if (isLoading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error.message}</div>;
  if (!productDetail) return <div>Không tìm thấy sản phẩm</div>;
  const renderStar = (num, max = 5) => {
  return Array.from({ length: max }, (_, index) =>
    index < num ? (
      <StarFilled key={index} style={{ color: 'rgb(253,216,54)' }} />
    ) : (
      <StarOutlined key={index} style={{ color: 'rgb(253,216,54)' }} />
    )
  );
};
 const onChange = (value) => {
    if (value >= 1) {
      setnumProduct(value);
    }
  };
 const handleChangeCount = (type) => {
    setnumProduct((prev) => {
      if (type === 'increase') return prev + 1;
      if (type === 'decrease') return prev > 1 ? prev - 1 : 1;
      return prev;
    });
  }; 
 const handleAddOderProduct = ()=>{

  if(!user?._id){
    navigate('/sign-in',{state :location?.pathname});
  }
  if(productDetail?.countInStock === 0){
      message.warning('sản phẩm đã hết hàng vui lòng chọn sản phẩm khác')
       navigate('/')
  }
  else{
    dispatch(addOrderProduct({
      orderItems :
        {
        name : productDetail?.name,
        amount: numProduct  ,
        image : productDetail?.image,
        price :productDetail?.price,
        Product :productDetail?._id, 
        discount : productDetail?.discount,  
      }
    }))}
  
 }
 console.log('productDetail' , productDetail);
  return (
    
      <Row style={{padding:"16px" , background :'#fff' , borderRadius : '4px'}} >
        <Col span={10} style={{borderRight:'1px solid #e5e5e5' ,paddingRight : '8px'}}>
          <Image
            src={imageproduct}
            width={500}
            height={500}
            alt="image product"
            preview={false}
          />
          <Row style={{paddingTop: '10px' ,justifyContent: 'space-between'}}>
            <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall src='https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwxoz5gna5lnd2.webp' alt='WrapperStyleImageSmall small' preview ={false}/>
            </WrapperStyleColImage><WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall src='https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwxoz5gna5lnd2.webp' alt='WrapperStyleImageSmall small' preview ={false}/>
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall src='https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwxoz5gna5lnd2.webp' alt='WrapperStyleImageSmall small' preview ={false}/>
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall src='https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwxoz5gna5lnd2.webp' alt='WrapperStyleImageSmall small' preview ={false}/>
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall src='https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwxoz5gna5lnd2.webp' alt='WrapperStyleImageSmall small' preview ={false}/>
            </WrapperStyleColImage>
            <WrapperStyleColImage span={4}>
            <WrapperStyleImageSmall src='https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lwxoz5gna5lnd2.webp' alt='image small' preview ={false}/>
            </WrapperStyleColImage>
          </Row>
        </Col>
        <Col span={14} style={{paddingLeft:' 10px'}}>
        <WrapperStyleNameProduct>{productDetail?.name}</WrapperStyleNameProduct>
        <div>
           {renderStar(productDetail?.rating)}
           
    
         <WrapperStyleTextSell>| Đã Bán {productDetail?.selled}+</WrapperStyleTextSell>

        </div>
        <WrapperPriceProduct>
          <WrapperPriceTextProduct>
          
          { converPrice(productDetail?.price)}   
          </WrapperPriceTextProduct>
           <h3> giảm giá: {productDetail?.discount}%</h3>
           {productDetail?.countInStock === 0 ? (
  <h4>Hết hàng</h4>
) : (
  <h4>Hàng còn: {productDetail?.countInStock} sản phẩm</h4>
)}
        </WrapperPriceProduct>
        <WrapperPriceAdressProduct>
          <span>giao đến </span>
          <span className='address'>{user?.addres}</span>
          <span className='change-address'> | đổi địa chỉ </span>
        </WrapperPriceAdressProduct>
        <div style={{ margin: '10px 0 20px', padding:'10px , 0 ' , borderTop : '1px solid #e5e5e5', borderBottom:'1px solid #e5e5e5'}}>
          <div style={{marginBottom:'10px' }}>số lượng</div>
          
<WrapperQualityProduct>
  <WrapperBtnQualityProduct>
    <ButtonComponent
      icon={<MinusOutlined />}
      onClick={() => handleChangeCount('decrease')}
      type="text"
    />
  </WrapperBtnQualityProduct>

  <WrapperInputNumber
    controls={false}
    onChange={onChange}
    value={numProduct}
    min={1}
  />

  <WrapperBtnQualityProduct>
    <ButtonComponent
      icon={<PlusOutlined />}
      onClick={() => handleChangeCount('increase')}
      type="text"
    />
  </WrapperBtnQualityProduct>
</WrapperQualityProduct>
        </div>
        <div style={{display :'flex', alignItems :'center' ,gap :'20px'}}>
          <ButtonComponent 
          size={40}
          textButton={'chọn mua '}
          bgColor="#ff4d4f"
           textColor="#fff" 
           height='48px'
           width='220px'
           onClick= {handleAddOderProduct}

          >
          </ButtonComponent>

           <ButtonComponent 
           size={40}
           textButton={'Thêm vào giỏ hàng'}
           bgColor="#ffffff"
           textColor="rgb(55, 93, 138)" 
           height='48px'
           width='220px'
           fontSize='15px'
           borderRadius='8px'
           border="2px solid #5789b3" 
           
        

          >
          </ButtonComponent>
        </div>
         </Col>
      </Row>
    
  );
};

export default ProductDetailComponent;

const WrapperStyleImageSmall = styled(Image)`
  height: 64px;
  width: 64px;
  padding: 12px;
`;
const WrapperStyleColImage = styled(Col)`
  flex-basis: unset;
  display: flex;
`;
const WrapperStyleNameProduct = styled.h1`
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    font-size: 20px;
    font-weight: 500;
    line-height: 24px;
    margin: 0;
    max-height: 48px;
    max-width: 665px;
    overflow: hidden;
    overflow-wrap: break-word;

`;
const WrapperStyleTextSell = styled.span`
font-size: 15px;
line-height: 24px;
color: rgb(120 , 120 , 120);
`;
const WrapperPriceProduct = styled.div`
  background: rgb(250 , 250 ,250 ) ;
  border-radius : 4px ;
`;
const WrapperPriceTextProduct = styled.div`
  font-size: 32px;
  line-height: 40px;
  margin-right: 8px;
  font-weight: 500;
  padding: 10px;
  margin-top: 10px;
`; 
const WrapperPriceAdressProduct = styled.div`
   span.address{
    text-decoration: underline;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
   }
   span.change-address{
    color: rgb(11,116,229);
    font-size: 16px;
    line-height: 24px;
    font-weight: 500;
    
   }
`; 
const WrapperQualityProduct = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  width: fit-content;
  height: 40px;
`;
const WrapperInputNumber = styled(InputNumber)`
  width: 40px !important;
  font-size: 16px;
  border: none;
  text-align: center;
  input {
    text-align: center;
    padding: 0;
    height: 38px;
  }
`;
const WrapperBtnQualityProduct = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 100%;
  background-color: #f5f5f5;
  border-right: 1px solid #ddd;
  cursor: pointer;

  &:last-child {
    border-right: none;
    border-left: 1px solid #ddd;
  }

  &:hover {
    background-color: #e6f7ff;
  }
`;