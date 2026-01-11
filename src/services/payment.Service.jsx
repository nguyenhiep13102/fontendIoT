import axios from "axios";
import env from '../../env'


export const creatvnpay = async ( id )=> {
  try {
    const res = await axios.post(`${env.API_URL}/payment/creatvnpay`, {id} , 
    { headers : { 
      Authorization: `Bearer ${accessToken}`,ss
    }}
   );
    return res.data;
  } catch (error) {
    return error.response?.data;s
  }
}