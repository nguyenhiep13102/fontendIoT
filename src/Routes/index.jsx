import HomePages from "../pages/HomePages/HomePages";
import homenew from "../pages/HomeNew";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OdersPages from "../pages/OdersPage/OdersPages";
import ProductDetailPage from "../pages/ProductDetail/ProductDetailPage";
import ProductPage from "../pages/ProductsPage/ProductPage";
import SignInPage from "../pages/SignInPage/SignInPage";
import SignUpPage from "../pages/SignUpPage/SignUpPage";
import TypeProductPage from "../pages/TypeProductPage/TypeProductPage";
import ProfilePage from "../pages/ProfilePages/ProfilePages";
import AdminProduct from '../pages/test/testupload'
import AdminPage from '../pages/AdminPage/AdminPages' 
import OrderPages from '../pages/OdersPage/OdersPages'
import CheckOutPage  from "../pages/CheckOutPage/CheckOutPage";
import myorder from '../pages/MyOrder/my_order'
import  DetailOrderId from '../pages/detailOrderId/DetailOrderId'
 import  ListFanIoT from '../pages/ListFanIoT/index'
 import remodeFan from '../pages/remodFan/index'
import FanBarChart from '../pages/BarChartPage/index'
export const routes =[
    {
    path: '/',
    page :homenew,
    isShowHeader: true,
    },
     {
    path: '/remodeFan/:id',
    page :remodeFan,
    isShowHeader: true,
    },
    {
    path: '/FanBarChart/:id',
    page :FanBarChart,
    isShowHeader: true,
    },
     {
    path: '/Product',
    page :ProductPage,
    isShowHeader: true,
    },
     {
    path: '/Oder',
    page :OdersPages,
    isShowHeader: true,
    },
    {
    path: '/my-order',
    page :myorder,
    isShowHeader: true,
    },
    {
    path: '/ListFanIoT',
    page :ListFanIoT,
    isShowHeader: true,
    },
    {
    path: 'Product/:type',
    page :TypeProductPage,
    isShowHeader: true,
    },
     {
    path: 'DetailsOrder/:id',
    page :DetailOrderId,
    isShowHeader: true,
    },
    {
    path: '/sign-in',
    page :SignInPage,
    isShowHeader: false,
    },
    {
    path: '/sign-up',
    page :SignUpPage, 
    isShowHeader: false,
    },
    {
    path: '/product-detail/:id',
    page :ProductDetailPage,
    isShowHeader: true,
    },
     {
    path: '/Order',
    page :OrderPages,
    isShowHeader: true,
    },
    {
    path: '/profile-Pages',
    page : ProfilePage,
    isShowHeader: true,
    },
    {
    path: '/test',
    page : AdminProduct,
    isShowHeader: true,
    },
    {
    path: '/system/admin',
    page : AdminPage,
    isShowHeader: false,
    isPrivate : true
    },
    {
    path: '/Checkout',
    page : CheckOutPage,
    isShowHeader: true,
  
    },
    {
    path: '/*',
    page :NotFoundPage,
    isShowHeader: false,
    },
] 

