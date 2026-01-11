import styled from "styled-components";
import TypeProduct from "../../components/TypeProduct/TypeProduct";
import SliderComponent from "../../components/SliderComponent/SliderComponent";
import slider1 from "../../assets/images/anh3.jpg"
import slider2 from "../../assets/images/anh1.jpg"
import slider3 from "../../assets/images/anh2.jpg"
import CardComponent from "../../components/CardComponent/CardComponent";
import Navbarcomponent from "../../components/Navbarcomponent/Navbarcomponent";
import Buttoncomponent from "../../components/Buttoncomponent/Buttoncomponent";
import Productsevice from "../../services/ProductService"
import { useQuery } from "@tanstack/react-query";
import { data, useLocation } from "react-router-dom";
import loading from "../../components/LoadingComponent/loading";
import * as OrderService from '../../services/OrderService'; 
import { removeOrderProduct } from '../../redux/slides/Oderslice';
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import { message } from "antd";
const HomePages = () => {
  const arr= []
  const refSearch = useRef();
   const dispatch = useDispatch();
  const [limit , setlimit] = useState(10);
   const [AllTypeProduct , setAllTypeProduct] = useState([]);
    const user = useSelector((state) => state.user);

   const location = useLocation();

 useEffect(() => {
    const handlePaymentResult = async () => {
      const query = new URLSearchParams(location.search);
      const status = query.get('status');
      const orderId = query.get('orderId');
      console.log('in ra ordet trong home ', orderId)

      if (status === 'success') {
        message.success('Thanh toán thành công!');
        if (orderId) {
          try {   
            console.log('in ra acsess', user.access_token)
            const result = await OrderService.getOrderById(orderId, user.access_token);
            console.log('Order info:', result);
           result?.data?.oderItems?.forEach(item => {
            dispatch(removeOrderProduct({ orderItems: { Product: item.Product } }));
        });
          } catch (error) {
            console.error('Lỗi khi xử lý đơn hàng:', error?.response?.data || error.message);
            message.error('Không thể xử lý đơn hàng!');
          }
        }
      } else if (status === 'fail') {
        message.error('Thanh toán thất bại!');
      } else if (status === 'error') {
        message.error('Thanh toán thất bại!');
      }
    };

    handlePaymentResult();
  }, [location.search, user?.access_token]);

 const fetchProductAll = async({search='',limit , page }) => {
  const res = await Productsevice.getPaginatedProducts({search,limit,page});
   console.log('du lieu ', res);
   return res;
 }
  const Searchproduct = useSelector((state) => state?.product?.search);
 console.log('in ra search',Searchproduct)
 const fetChAllTypeProduct = async () => {
  try {
    const typeProduct = await Productsevice.getTypeProduct();
    setAllTypeProduct(typeProduct?.data)
    console.log('Type products:', typeProduct.data);
  } catch (error) {
    console.error('Error fetching product types:', error);
  }
};
useEffect(() => {
  fetChAllTypeProduct();
}, []);


 
const queryParams = {
  search: Searchproduct,
  limit: limit ,
  page: 0
};

const { isLoading, data: products } = useQuery(
  ['Product', queryParams],
  () => fetchProductAll(queryParams),
  {
    retry: 3,
    retryDelay: 3000,
    enabled: true, // luôn fetch nếu cần
  }
);

  return(
  // <div style={{padding : `0 120px`}}>
  //   <WrapperTyoeProduct>
  //   {arr.map((item)=>{
  //     return (
  //      <TypeProduct name  = {item} key={item} />
  //     )
  //   })}
  // </WrapperTyoeProduct>
  //   <div id = 'container' style={ {backgroundColor : '#efefef'}}>
  //   <SliderComponent arrImages={[slider1, slider2, slider3]} />
  //   </div>
  //   Home Pages
    
  //   </div>

  <>
  <loading isLoading={isLoading}>
     <div style={{padding : `0 auto`, background:'#fff' , width: '1270px'}}>
       <WrapperTyoeProduct>
       {AllTypeProduct.map((item)=>{
        return (
         <TypeProduct name = {item} key={item}  style= {{fontsize : '16px'}} />
        )
       })}
     </WrapperTyoeProduct>
     </div> 
         <div id = 'container' style={ {backgroundColor : 'none' , padding :'0 120px', height: '1000px', width:'1270px', margin: '0 auto'}}>
         <SliderComponent arrImages={[slider1, slider2, slider3]} />
         <WrapperProducts>
          {products?.data.map((product) => (
      <CardComponent key={product._id} data={product} id={product._id} />
    ))}
                                     
         </WrapperProducts>
         <div style={{width:'100%',display:'flex', justifyContent:'center', marginTop:'10px'}}>
          <HomePageButton 
          textButton="Xem Thêm "
           onClick={() => setlimit(prev => prev + 10)}
           />
        </div>
          
         </div>
           {/* <Navbarcomponent/> */}
           </loading>

         
         
  </>
  )
}

export default HomePages;
const WrapperTyoeProduct= styled.div`
  display: flex;
  align-items: center ;
  gap: 24px ;
  justify-content: flex-start;
  border-bottom: 1px solid red;
  height: 44px;
  padding-left: 150px;
`;
const HomePageButton = styled(Buttoncomponent)`
  background-color: #ffffff !important;
  color: #3db5be !important;
  border: 2px solid blue !important;
  border-radius: 4px !important;
  padding: 10px 20px !important;
  font-size: 16px !important;
  width: 240px;
  height: 40px ;
  justify-content: center;

  &:hover {
    background-color: #5a92a5 !important;
    border-color: #7a7aa7 !important;
    color: white !important;
  }
`;
const WrapperProducts= styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
`;