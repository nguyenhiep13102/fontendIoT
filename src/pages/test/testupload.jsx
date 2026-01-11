import React, { useState, useEffect } from 'react';
import {
  Table,
  Tag,
  Space,
  Button,
  Tabs,
  Modal,
  Descriptions,
  message,
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import OrderService from '../../services/OrderService';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const { TabPane } = Tabs;

const statusColors = {
  pending: 'orange',
  confirmed: 'blue',
  paid: 'cyan',
  shipping: 'gold',
  delivered: 'green',
  cancelled: 'red',
};

const statusLabels = {
  pending: 'Chờ xác nhận',
  confirmed: 'Đã xác nhận',
  paid: 'Đã thanh toán',
  shipping: 'Đang giao hàng',
  delivered: 'Đã giao hàng',
  cancelled: 'Đã huỷ',
};

const AdminOrderManagement = () => {
  const user = useSelector((state) => state.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const fetchOrders = async (status = '') => {
    setLoading(true);
    try {
      const res = await OrderService.getOrder(
        status !== 'all' ? status : '',
        user.access_token
      );
      setOrders(res?.data || []);
    } catch (error) {
      message.error('Lỗi khi lấy danh sách đơn hàng');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders(activeTab);
  }, [activeTab]);

  const handleViewDetail = (order) => {
    setSelectedOrder(order);
    setOpenModal(true);
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await OrderService.updateOrderStatus(id, user.access_token, status);
      message.success(`Cập nhật đơn ${id} sang trạng thái ${statusLabels[status]}`);
      fetchOrders(activeTab); // refresh lại dữ liệu
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const exportToExcel = () => {
    const data = [];

    orders.forEach((order) => {
      order.oderItems.forEach((item) => {
        const discount = item.discount || 0;
        const totalLine = item.price * item.amount * (1 - discount / 100);

        data.push({
          'Mã đơn': order._id,
          'Ngày đặt': new Date(order.createdAt).toLocaleDateString('vi-VN'),
          'Khách hàng': order.shippingAddress.fullName,
          'SĐT': order.shippingAddress.phone,
          'Địa chỉ': `${order.shippingAddress.adress}, ${order.shippingAddress.city}`,
          'Tên SP': item.name,
          'SL': item.amount,
          'Đơn giá': item.price,
          'Giảm giá (%)': discount,
          'Tổng': order.totalPrice,
          'PT thanh toán': order.paymentMethod,
          'Trạng thái': statusLabels[order.status],
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DonHang');

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    const blob = new Blob([excelBuffer], {
      type: 'application/octet-stream',
    });
    saveAs(blob, `DonHang_${activeTab}_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const columns = [
    {
      title: 'Mã đơn',
      dataIndex: '_id',
      key: '_id',
    },
    {
      title: 'Khách hàng',
      dataIndex: ['shippingAddress', 'fullName'],
      key: 'fullName',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `${price.toLocaleString()}₫`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>,
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_, record) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>
            Chi tiết
          </Button>
          {record.status === 'pending' && (
            <Button onClick={() => handleUpdateStatus(record._id, 'confirmed')}>
              Xác nhận
            </Button>
          )}
          {record.status === 'confirmed' && (
            <Button onClick={() => handleUpdateStatus(record._id, 'shipping')}>
              Giao hàng
            </Button>
          )}
          {record.status === 'shipping' && (
            <Button onClick={() => handleUpdateStatus(record._id, 'delivered')}>
              Hoàn tất
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <Tabs activeKey={activeTab} onChange={(key) => setActiveTab(key)}>
        <TabPane tab="Tất cả" key="all" />
        <TabPane tab="Chưa xác nhận" key="pending" />
        <TabPane tab="Đã xác nhận" key="confirmed" />
        <TabPane tab="Đã thanh toán" key="paid" />
        <TabPane tab="Đang giao" key="shipping" />
        <TabPane tab="Đã giao" key="delivered" />
        <TabPane tab="Đã huỷ" key="cancelled" />
      </Tabs>

      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={exportToExcel}
        disabled={orders.length === 0}
      >
        Xuất Excel
      </Button>

      <Table columns={columns} dataSource={orders} loading={loading} rowKey="_id" />

      <Modal
        title="Chi tiết đơn hàng"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        {selectedOrder && (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="Khách hàng">
              {selectedOrder.shippingAddress.fullName}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedOrder.shippingAddress.phone}
            </Descriptions.Item>
            <Descriptions.Item label="Địa chỉ">
              {selectedOrder.shippingAddress.adress},{' '}
              {selectedOrder.shippingAddress.city}
            </Descriptions.Item>
            <Descriptions.Item label="Tổng tiền">
              {selectedOrder.totalPrice.toLocaleString()}₫
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {selectedOrder.paymentMethod}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default AdminOrderManagement;
