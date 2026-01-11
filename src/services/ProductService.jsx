import axios from "axios";
import env from '../../env'

export const getAllProduct = async (search) => {
  try {
    const res = await axios.get(`${env.API_URL}/Product/getAllProduct`);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
};  
export const creatProduct = async (formData) => {
  try {
    
    const res = await axios.post(`${env.API_URL}/Product/create-Product`, formData,{
      headers: {
            'Content-Type': 'multipart/form-data',
          },
    });

    return res.data;
  } catch (error) {
    return error.response?.data;
  }
};  
export const getProductDetail = async (id) => {
  try {    
    const res = await axios.get(`${env.API_URL}/Product/getProductDetail/${id}`    
    );
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
};  
export const updateProduct = async (id , formData,accessToken)=> {
  try {
    const res = await axios.put(`${env.API_URL}/Product/update-Product/${id}`,formData,
    { headers : { 
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'multipart/form-data',
    }}
   );
   console.log(formData);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}
export const DeleteProduct = async (id ,accessToken)=> {
  try {
    const res = await axios.delete(`${env.API_URL}/Product/delete-Product/${id}`,
    { headers : { 
      Authorization: `Bearer ${accessToken}`,
    }}
   )
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}

export const DeleteManyProduct = async (data ,accessToken)=> {
  try {
    console.log(data);
    const res = await axios.post(`${env.API_URL}/Product/delete-many`,{ ids: data },
    { headers : { 
      Authorization: `Bearer ${accessToken}`,
    }}
   )
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}
export const getPaginatedProducts = async ({ search ='', limit , page, type  }) => {
  try {
    const params = new URLSearchParams();
     if (type) params.append('type', type);
    if (search) params.append('search', search);
    if (limit) params.append('limit', limit);
    if (page) params.append('page', page);

    console.log(params.toString());

    const res = await axios.get(`${env.API_URL}/Product/getPaginatedProducts?${params.toString()}`);
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
};
export const getTypeProduct = async ()=> {
  try {
    const res = await axios.get(`${env.API_URL}/Product/getAllType`, )
    return res.data;
  } catch (error) {
    return error.response?.data;
  }
}
export default {
getAllProduct,
creatProduct,
getProductDetail,
updateProduct,
DeleteProduct,
DeleteManyProduct,
getPaginatedProducts,
getTypeProduct,
};