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
import {
  Breadcrumb,
} from 'antd';
import { Card, Typography } from 'antd';
import { HomeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;

/* ================= MOCK DATA (100 points / lần) ================= */
const fetchFanLineData = async () => {
  const now = Date.now();

  // tạo 100 điểm dữ liệu, mỗi điểm cách nhau 1 phút
  return Array.from({ length: 100 }).map((_, index) => {
    const time = new Date(now - (99 - index) * 60000);

    return {
      time: time.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      temperature: Math.floor(Math.random() * 20) + 3, // 30–35°C
    };
  });
};

/* ================= PAGE ================= */
const FanLineChartPage = () => {
  const { data = [], isLoading, dataUpdatedAt } = useQuery({
    queryKey: ['fan-line-chart'],
    queryFn: fetchFanLineData,
    refetchInterval: 10000, // 🔥 10s update
    refetchIntervalInBackground: false,
  });
const navigate = useNavigate();
  return (
    <PageContainer>
      <StyledCard loading={isLoading}>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => navigate('/')}>
            <HomeOutlined /> Trang chủ
          </Breadcrumb.Item>
          <Breadcrumb.Item>Thiết bị IoT của tôi</Breadcrumb.Item>
        </Breadcrumb>
        <Title level={3} style={{ margin: '16px 0' }}>
          Danh sách thiết bị IoT
        </Title>
        <Header>
          <Title level={4}>📈 Biểu đồ nhiệt độ theo thời gian</Title>
          <Text type="secondary">
            Cập nhật lúc:{' '}
            {dataUpdatedAt
              ? new Date(dataUpdatedAt).toLocaleTimeString('vi-VN')
              : '--'}
          </Text>
        </Header>

        <ChartWrapper>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="time"
                interval={9} // 👉 hiển thị ~10 mốc cho đỡ rối
              />
              <YAxis unit="°C" domain={[28, 100]} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="temperature"
                stroke="#1677ff"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartWrapper>

        <Footer>
          100 điểm dữ liệu • Tự động cập nhật mỗi 10 giây
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
  margin-top: 10px;
`;

const Footer = styled.div`
  margin-top: 12px;
  font-size: 12px;
  color: #6b7280;
  text-align: right;
`;
