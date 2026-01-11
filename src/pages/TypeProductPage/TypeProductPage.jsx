import { Col, Pagination, Row } from "antd";
import CardComponent from "../../components/CardComponent/CardComponent";
import Navbarcomponent from "../../components/Navbarcomponent/Navbarcomponent";
import styled from "styled-components";
import Productsevice from "../../services/ProductService";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Loading from "../../components/LoadingComponent/loading";

export const TypeProductPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const location = useLocation();
  const pathSegments = location.pathname.split("/");
  const productType = decodeURIComponent(pathSegments[pathSegments.length - 1]);

  const Searchproduct = useSelector((state) => state?.product?.search);

  const fetchProductType = async ({ search = "", limit, page, type }) => {
    setLoading(true);
    const products = await Productsevice.getPaginatedProducts({
      search,
      limit,
      page,
      type,
    });
    if (products?.status === "success") {
      setProducts(products?.data);
    }
    setLoading(false);
    return products;
  };

  useEffect(() => {
    if (productType) {
      const queryParams = {
        search: Searchproduct,
        limit,
        page: currentPage - 1, // vì API bắt đầu từ 0
        type: productType,
      };
      fetchProductType(queryParams);
    }
  }, [Searchproduct, limit, productType, currentPage]);

  const onChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Loading isloading={loading}>
        <div style={{ width: "100%", background: "#efefef" }}>
          <div style={{ width: "1270px", margin: "0 auto" }}>
            <Row style={{ flexWrap: "nowrap", paddingTop: "10px" }}>
              <WrapperNavbar span={4}>
                <Navbarcomponent />
              </WrapperNavbar>
              <Col span={20}>
                <WrapperProducts>
                  {products?.map((product) => (
                    <CardComponent
                      key={product._id}
                      data={product}
                      id={product._id}
                    />
                  ))}
                </WrapperProducts>
                <WrapperPagination>
                  <Pagination
                    showQuickJumper
                    defaultCurrent={1}
                    current={currentPage}
                    pageSize={limit}
                    total={500}
                    onChange={onChange}
                  />
                </WrapperPagination>
              </Col>
            </Row>
          </div>
        </div>
      </Loading>
    </>
  );
};

export default TypeProductPage;
const WrapperProducts = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-top: 20px;
  flex-wrap: wrap;
`;

const WrapperNavbar = styled(Col)`
  background: #fff;
  margin-right: 10px;
  padding: 10px;
  border-radius: 6px;
  height: fit-content;
  margin-top: 20px;
  width: 200px;
`;

const WrapperPagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  padding-bottom: 40px;

  .ant-pagination {
    font-size: 16px;
  }

  .ant-pagination-item,
  .ant-pagination-next,
  .ant-pagination-prev {
    border-radius: 6px;
    margin: 0 4px;
  }

  .ant-pagination-item-active {
    border-color: #1677ff;
    a {
      color: #1677ff;
    }
  }
`;
