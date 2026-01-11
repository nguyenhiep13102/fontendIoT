import { Menu } from 'antd';
import React, { useState } from 'react'
import { AppstoreOutlined,  SettingOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import getLevelKeys from '../../utlis'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent';
import { AdminUser } from '../../components/AdminUser/AdminUser';
import { AdminProduct } from '../../components/AdminProduct/AdminProduct';
import  AdminOrderManagement  from '../../components/AdminOrderManagement/AdminOrderManagement';
const items = [
  {
    key: 'user',
    icon: <UserOutlined />,
    label: 'Người Dùng '
  },
  {
    key: 'product',
    icon: <AppstoreOutlined />,
    label: 'Sản Phẩm ',  
  },
  {
    key: 'Order',
    icon: <ShoppingCartOutlined />,
    label: 'Đơn hàng', 
  },
]; 
const levelKeys = getLevelKeys.getLevelKeys(items);
export const AdminPages = () => {
    const [stateOpenKeys, setStateOpenKeys] = useState(['2', '23']);
     const [keySelected, setkeySelected] = useState(['']);
  const onOpenChange = (openKeys) => {
    const currentOpenKey = openKeys.find(key => stateOpenKeys.indexOf(key) === -1);
    console.log('openKeys:', openKeys);
  console.log('currentOpenKey:', currentOpenKey);
    if (currentOpenKey !== undefined) {
      const repeatIndex = openKeys
        .filter(key => key !== currentOpenKey)
        .findIndex(key => levelKeys[key] === levelKeys[currentOpenKey]);
      setStateOpenKeys(
        openKeys
          // remove repeat key
          .filter((_, index) => index !== repeatIndex)
          // remove current level all child
          .filter(key => levelKeys[key] <= levelKeys[currentOpenKey]),
      );
    } else {
      // close
      setStateOpenKeys(openKeys);
    }
  };
const  handleOnclick = ({ item, key, keyPath, domEvent })=> {
    console.log('Đã click vào key:', key);
    setkeySelected(key)
    return keySelected;
}
console.log('key ' , keySelected);

const renderPage = (key) => {
 switch (key){
     case 'user':
        return (
            <AdminUser/>
        )
    case  'product' : {
        return (
            <AdminProduct/>
        )
    }
     case  'Order' : {
        return (
            <AdminOrderManagement/>
        )
    }
    
    default: 
    return <></>
 }
}

  return (
    <>
    <HeaderComponent isHiddenSearch={true} isHiddentCart={true}/>
    <div style={{display: 'flex'}}>  
    <Menu
      mode="inline"
     setkeySelected ={[keySelected]}
      openKeys={stateOpenKeys}
      onOpenChange={onOpenChange}
      items={items}
      onClick={handleOnclick}
      style = {{width :'256px',
                boxShadow : '1px 1px 2px #ccc',
                height : '100vh'

      } }
    />
   
       <div style={{flex: 1 ,  paddingLeft: '24px' }}>
        {renderPage(keySelected)}

       </div>
    </div>
    
    </>
  )
}
export default AdminPages;