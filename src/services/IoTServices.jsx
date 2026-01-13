import axios from "axios"
import env from '../../env'



export const GetDeviceInformation = async (search) => {
  try {
    const res = await axios.get(`${env.API_URL}/fanroute/state/693f198ffa8e64558eb4dea1`);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
};  
 export const getMyIoT = async (id ,accessToken)=> {
  try {
    const res = await axios.get(`${env.API_URL}/fanroute/state/${id}`,
    { headers : {
      Authorization: `Bearer ${accessToken}`, 
    }}
   );  
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}
export const GetfanbyId = async (id) => {
  try {
    const res = await axios.get(`${env.API_URL}/fanroute/getFanId/${id}`);
    console.log('res service', res);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
};  

export const ControllerFan = async (data) => {
  try {
    const res = await axios.post(`${env.API_URL}/fanroute/control` , data);
    console.log('res service', data);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
};  
 export const chartFan = async (fanId) => {
  if (!fanId) {
    return { data: [] };
  }

  try {
    const res = await axios.get(
      `${env.API_URL}/fanroute/chart/${fanId}`
    );
    return res.data ?? { data: [] };
  } catch (error) {
    console.error('chartFan error', error);
    return { data: [] }; // ✅ BẮT BUỘC
  }
};
export const modelAuto = async (fanId) => {
  try {
    const res = await axios.post(`${env.API_URL}/fanroute/SettingAuto/${fanId}` );
    console.log('res service', data);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}; 

export default {
    GetDeviceInformation,
    getMyIoT,
    GetfanbyId,
    chartFan,
    modelAuto,
}