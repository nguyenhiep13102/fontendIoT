import { useNavigate, useParams } from "react-router-dom";
import ProductDetailComponent from "../../components/ProductDetailComponent/ProductDetailComponent";

export const ProductDetailPage = () => {
  const {id} = useParams();
 const navigate = useNavigate();
  return (
    <div style={{padding:'0 120px', background : '#efefef'}}>
      <h5><span style={{cursor: 'pointer', fontWeight :'bold' ,fontSize: '16px'}} onClick={()=>{navigate('/')}}>Trang Chủ </span> &gt; chi tiết sản phẩm  </h5>
      <div style={{
        display :'flex', background: '#fff'
      }}>
      <ProductDetailComponent  isProduct = {id}   />
      </div>
    </div>
  )
}
export default ProductDetailPage;
