

import { useNavigate } from "react-router-dom";
import until from '../../utlis'
export const TypeProduct = ({name}) => {
  const navigate = useNavigate();
  // const Nametype = until.toSlug(name)

  const  handleNavigatetype = (type)=>{
   navigate(`Product/${type}`)
  }
  return (
    <div style={
      {padding: ' 0 , 10px',fontSize: '18px' ,cursor :'pointer'}}
     onClick={() => handleNavigatetype(name)}

    >{name}</div>
  )
}
export default TypeProduct;