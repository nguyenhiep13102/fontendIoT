import React from 'react';
import styled from 'styled-components';
import { useQuery } from '@tanstack/react-query';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Breadcrumb, Card, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import * as MyIoTService from '../../services/IoTServices';

const { Title, Text } = Typography;

const FanLineChartPage = () => {
  const navigate = useNavigate();

  // ✅ PHẢI TRÙNG VỚI ROUTER :id
  const { id: fanId } = useParams();

  /* ================= FETCH CHART ================= */
  const {
    data: chartRes,
    isLoading,
    isFetching,
    dataUpdatedAt,
  } = useQuery({
    queryKey: ['fanChart', fanId],
    queryFn: () => MyIoTService.chartFan(fanId),
    enabled: !!fanId, // 🔥 BẮT BUỘC
    refetchInterval: 10000,
    refetchOnWindowFocus: false,
    retry: false,
  });

  console.log('chartRes', chartRes);

  /* ================= TRANSFORM DATA ================= */
  const chartData = Array.isArray(chartRes?.data)
    ? chartRes.data.map(item => ({
        time: new Date(item.createdAt).toLocaleTimeString('vi-VN'),
        temperature: item.TemperatureSensor,
      }))
    : [];

  return (
    <PageContainer>
      <StyledCard loading={isLoading}>
        {/* ===== Breadcrumb ===== */}
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate('/')}>
            <HomeOutlined /> Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item>Thiết bị IoT</Breadcrumb.Item>
          <Breadcrumb.Item>Biểu đồ</Breadcrumb.Item>
        </Breadcrumb>

        {/* ===== Title ===== */}
        <Title level={3} style={{ margin: '16px 0' }}>
          Biểu đồ nhiệt độ
        </Title>

        {/* ===== Header ===== */}
        <Header>
          <Title level={4}>📈 Nhiệt độ theo thời gian</Title>
          <Text type="secondary">
            {isFetching ? '🔄 Đang cập nhật...' : '✅ Đã cập nhật'} •{' '}
            {dataUpdatedAt
              ? new Date(dataUpdatedAt).toLocaleTimeString('vi-VN')
              : '--'}
          </Text>
        </Header>

        {/* ===== Chart ===== */}
        <ChartWrapper>
          {chartData.length === 0 ? (
            <EmptyText>Không có dữ liệu</EmptyText>
          ) : (
            <ResponsiveContainer width="100%" height={320}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" interval={8} />
                <YAxis unit="°C" />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="temperature"
                  stroke="#1677ff"
                  strokeWidth={2.5}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </ChartWrapper>

        {/* ===== Footer ===== */}
        <Footer>
          {chartData.length} điểm dữ liệu • Tự động cập nhật mỗi 10 giây
        </Footer>
      </StyledCard>
    </PageContainer>
  );
};

export default FanLineChartPage;

/* ================= STYLE ================= */

const PageContainer = styled.div`
  background: #f9fafb;
  padding: 24px;
  max-width: 1100px;
  margin: 40px auto;
`;

const StyledCard = styled(Card)`
  border-radius: 20px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08);
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
`;

const ChartWrapper = styled.div`
  margin-top: 12px;
`;

const Footer = styled.div`
  margin-top: 12px;
  font-size: 12px;
  color: #6b7280;
  text-align: right;
`;

const EmptyText = styled.div`
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
`;
