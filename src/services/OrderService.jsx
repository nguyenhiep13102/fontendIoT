import axios from "axios";
import env from '../../env'

export const CreactOrder = async ( orderPayload,accessToken)=> {
  try {
    const res = await axios.post(`${env.API_URL}/Order/creatOrder`,orderPayload,
    { headers : { 
      Authorization: `Bearer ${accessToken}`,
    }}
   );
   console.log(orderPayload);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}
export const getOrderdetail = async (id ,accessToken)=> {
  try {
    const res = await axios.get(`${env.API_URL}/Order/get-Order-detail/${id}`,
    { headers : {
      Authorization: `Bearer ${accessToken}`, 
    }}
   );  
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}
export const getOrderById = async (id ,accessToken)=> {
  try {
    const res = await axios.get(`${env.API_URL}/Order/DetailOrderbyid/${id}`,
    { headers : {
      Authorization: `Bearer ${accessToken}`, 
    }}
   );  
    return res;
  } catch (error) {
    return error.response?.data;
  }
}
export const cancelOrder = async (id ,accessToken)=> {
  try {
    const res = await axios.post(`${env.API_URL}/Order/cancelOrder/${id}`,{},
    { headers : {
      Authorization: `Bearer ${accessToken}`, 
    }}
   );  
   
    return res.data;

  } catch (error) {
    return error.response?.data;
  }
}
export const getOrder = async (status ,accessToken)=> {
  try {
    console.log(accessToken)
     const params = new URLSearchParams();
     if (status) params.append('status', status);
    const res = await axios.get(`${env.API_URL}/Order/admin/getAllorders2?${params.toString()}`,
    { headers : {
      Authorization: `Bearer ${accessToken}`, 
    }}
   );  
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}
export const updateOrderStatus = async (orderId ,accessToken , status)=> {
  try {
    const res = await axios.post(`${env.API_URL}/Order/admin/update-status/${orderId}`,{status },
    { headers : {
      Authorization: `Bearer ${accessToken}`, 
    }}
   );  
    
    return res.data;

  } catch (error) {
    return error.response?.data;
  }
}

export const creatvnpay = async (orderId, access_token)=> {
  try {
    const res = await axios.post(`${env.API_URL}/payment/creatvnpay`,{orderId ,access_token}, 
   { headers : {
      Authorization: `Bearer ${access_token}`, 
    }}
   );
    return res.data;
  } catch (error) {
    return error.response?.data;s
  }
}
export default {
CreactOrder,
getOrderdetail,
getOrder,
updateOrderStatus,
creatvnpay,
}