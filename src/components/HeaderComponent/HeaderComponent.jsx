
import styled from "styled-components";
import { Avatar, Badge, Button, Col, Popover, Row,  } from "antd";

import * as style from './style.jsx'
import UserService from '../../services/UserServices.jsx';
import {
  UserOutlined,
  CaretDownOutlined,
  BellOutlined,
  
} from '@ant-design/icons';
import ButtonInputSeach from "../ButtonInputSeach/ButtonInputSeach";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {resetUser } from '../../redux/slides/userSide.jsx'
import {SearchProduct } from '../../redux/slides/ProductSide.jsx'
import { useState } from "react";
import Loadingcom from '../LoadingComponent/loading.jsx';
import env from '../../../env.js'
export const HeaderComponent = ({isHiddenSearch, isHiddentCart}) => {
     
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [loading , setloading] = useState(false);
    const [search , setsearch] = useState('');
    const handleNavigateLogin = () => {
        navigate('Sign-in');
    }
    const order = useSelector((state) => state.Oder.orderItems);
    console.log('order  o day co khong', order)
    const user = useSelector((state) => state.user)
    console.log('user', user);
    
const handleLogout =  async () => {
 
   setloading(true)
   await  UserService.logoutUser();
    dispatch(resetUser());
    setloading(false)
    navigate('/')
}
    const content = (
  <div>
    <WrapperContentPopup onClick={()=> {navigate('/profile-Pages')}} >thông tin người dùng </WrapperContentPopup>
    {user?.isAdmin &&(
        <WrapperContentPopup onClick={()=> {navigate('/system/admin')}}>Quản lí hệ thống </WrapperContentPopup>
    )}
        <WrapperContentPopup onClick={()=> {navigate('/ListFanIoT')}} > danh sách thiết bị hiện có </WrapperContentPopup>
        
        
      <WrapperContentPopup onClick={handleLogout}>Đăng xuất</WrapperContentPopup>
  </div>
);
const onSearch = (e)=> {
  // console.log('tim kiem ', e.target.value);
  setsearch(e.target.value)
  
}
 
const handleSearch = () => {
    dispatch(SearchProduct(search))
};

return(
   

    <div>
        <WrapperHeader gutter={16} style={{justifyContent:isHiddenSearch && isHiddentCart ? 'space-between' : 'unset' }}>
            <Col span={5}>
                <WrapperTextHeader onClick={()=> {navigate('/')}}>IoT Nhóm 15 </WrapperTextHeader>
            </Col>
           {!isHiddenSearch && (
               <Col span={13}>
               <ButtonInputSeach
                  placeholder="nhập thông tin tìm kiếm"
                size="large"
               textButton="tìm kiếm"
               onChange = {onSearch}
               onClick={handleSearch}
        />
         </Col>
       )}
            
            <Col span={6} style={{ display: `flex`, gap: `54px`, alignItems: 'center' }}>
                 <Loadingcom isloading={loading}>
                <WrapperHeaderAcount>
                  <Avatar
                   size={60}
                    
                   style={{ backgroundColor: 'rgb(17, 62, 158)' }}
                     icon={<UserOutlined />}
                  />
                    {
                        user?.name ? (                            
                        <div>                          
                            <Popover placement="bottom" title={''} content={content}>
                                 <div>
                                {user.name}
                            </div>                           
                            </Popover>                                   
                            </div>
                       
                        ) :(
                            <div onClick={handleNavigateLogin} style={{cursor: 'pointer'} }>
                        <WrapperTextHeaderSmall>Đăng nhập/Đăng ký  </WrapperTextHeaderSmall>
                        <div>
                            <WrapperTextHeaderSmall>Tài khoản   </WrapperTextHeaderSmall>
                            <CaretDownOutlined />
                        </div>
                         
                        

                    </div>
                    
                   
                        )   
                                            
                    }  
                                
                </WrapperHeaderAcount>
                

                </Loadingcom>

                {!isHiddentCart && (
                <div>
                    <BellOutlined style={{ fontSize: `30px`, color: `#fff` }} />
                    <Badge count = {order?.length} size="small">
                    <WrapperTextHeaderSmall onClick={()=> {navigate('/Order')}} ></WrapperTextHeaderSmall>
                    </Badge>
                </div>
                  )}
                
            </Col>
        </WrapperHeader>       
    </div>
)


}
export default HeaderComponent;


 const WrapperHeader= styled(Row)`
 align-items: center;
   padding: 10px 120px;
  background-color: rgb(17, 62, 158);
  gap: 16px;
  flex-wrap:nowrap ;
  `;
const WrapperTextHeader = styled.span`
  font-size  : 20px ;
  color: #fff;
  font-weight: bold;
  text-align: left;
`;
const WrapperHeaderAcount = styled.div`
    display: flex;
    align-items: center;
    color: white;
    gap: 10px;
    font-size: 12px;
`;
const WrapperTextHeaderSmall= styled.span`
  font-size  : 12px ;
  color: #fff;
  white-space: nowrap;
`;

const WrapperContentPopup = styled.p`
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  color: #333; /* màu chữ gốc */
  transition: background-color 0.3s;

  &:hover {
    background-color: #ebedf0;
    color: #333; /* giữ nguyên màu chữ rõ ràng */
  }
`;
