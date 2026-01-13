import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Divider,
  Breadcrumb,
  Slider,
} from 'antd';
import {
  PoweroffOutlined,
  ThunderboltOutlined,
  CloudOutlined,
  DashboardOutlined,
  HomeOutlined,

  RobotOutlined,
} from '@ant-design/icons';
import * as MyIoTService from '../../services/IoTServices';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const { Title, Text } = Typography;

const FanControlPage = () => {
  const [power, setPower] = useState(false);
  const [speed, setSpeed] = useState(0);
  const [mode, setMode] = useState('no');
 const queryClient = useQueryClient();
  const isFirstLoad = useRef(true);

  const navigate = useNavigate(); 
  const { id } = useParams();

  /* ================= API ================= */

  const fetchFanById = async () => {
    if (!id) return null;
    return await MyIoTService.GetfanbyId(id);
  };

  const { data } = useQuery({
    queryKey: ['fetchFanById', id],
    queryFn: fetchFanById,
    enabled: !!id,
    
  });

  const fan = data?.data;


  const controlFanMutation = useMutation({
    mutationFn: (payload) => MyIoTService.ControllerFan(payload),
  });



  useEffect(() => {
  if (!fan) return;
console.log('🔥 FAN FROM API:', fan);
  setPower(fan.status === 'ON');
  setSpeed(fan.Speed ?? 0);
}, [fan]);


  /* ================= HANDLER ================= */

  const togglePower = () => {
    const newPower = !power;

    setPower(newPower);
    if (!newPower) setSpeed(0);

    controlFanMutation.mutate({
      fanId: fan?.FAN_ID,
      status: newPower ? 'ON' : 'OFF',
      speed: newPower ? speed || 50 : 0,
    });
  };

 const handleSpeedChange = (value) => {
  setSpeed(value);
  if (!power) setPower(true);

  
  setMode('MANUAL');
};


  const handleSpeedAfterChange = (value) => {
    controlFanMutation.mutate({
      fanId: fan?.FAN_ID,
      status: 'ON',
      speed: value,
    });
  };

  const selectMode = (value) => {
  setMode(value);

  let newSpeed = 50;
  if (value === 'FAST') newSpeed = 100;
  if (value === 'BREEZE') newSpeed = 20;
  if (value === 'NORMAL') newSpeed = 50;
  

  setSpeed(newSpeed);
  setPower(true);

  controlFanMutation.mutate({
    fanId: fan?.FAN_ID,
    status: 'ON',
    speed: newSpeed,
  });
};
const autoMutation = useMutation({
  mutationFn: MyIoTService.modelAuto,

  onSuccess: (data) => {
    console.log('Auto mode success:', data);
    queryClient.invalidateQueries({
      queryKey: ['fetchFanById'], 
    });
    setMode('Auto');
  },

  onError: (error) => {
    console.error('Auto mode error:', error);
  },
});

 const handleAutoMode = (fanId) => {
  autoMutation.mutate(fanId);
};

  return (
    <PageContainer>
      <Breadcrumb>
        <Breadcrumb.Item onClick={() => navigate('/')}>
          <HomeOutlined /> Trang chủ
        </Breadcrumb.Item>
        <Breadcrumb.Item>Thiết bị IoT / {fan?.name}</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={3}>Điều khiển quạt IoT</Title>

      <Card>
        {/* HEADER */}
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={4} style={{ margin: 0 }}>
              🌀 {fan?.name}
            </Title>
            <Text type="secondary">Mã quạt: {fan?.FAN_ID}</Text>
          </Col>
          <Col>
            <Tag color={power ? 'green' : 'red'}>
              {power ? 'ON' : 'OFF'}
            </Tag>
          </Col>
        </Row>
        <div> Nhiệt độ :{fan?.TemperatureSensor} °C</div>

        <Divider />

        {/* SPEED */}
        <Row justify="space-between" align="middle">
          <Text>Tốc độ gió</Text>
          <SpeedWrapper>
            <StyledSlider
              min={0}
              max={100}
              value={speed}
              disabled={!power}
              onChange={handleSpeedChange}
              onAfterChange={handleSpeedAfterChange}
            />
            <SpeedValue>{speed}</SpeedValue>
          </SpeedWrapper>
        </Row>

        <Divider />

        {/* POWER */}
        <Row justify="space-between" align="middle">
          <Text>Nguồn quạt</Text>
          <Button
            type={power ? 'primary' : 'default'}
            danger={power}
            icon={<PoweroffOutlined />}
            onClick={togglePower}
          >
            {power ? 'Tắt quạt' : 'Bật quạt'}
          </Button>
        </Row>

        <Divider />

        {/* MODE */}
        <Text strong>Chế độ</Text>
        <Row gutter={[12, 12]} style={{ marginTop: 12 }}>
          <Col span={6}>
            <ModeButton active={mode === 'NORMAL'} onClick={() => selectMode('NORMAL')}>
              <DashboardOutlined />
              <span>Bình thường</span>
            </ModeButton>
          </Col>
          <Col span={6}>
            <ModeButton active={mode === 'FAST'} onClick={() => selectMode('FAST')}>
              <ThunderboltOutlined />
              <span>Nhanh</span>
            </ModeButton>
          </Col>
          <Col span={6}>
            <ModeButton active={mode === 'BREEZE'} onClick={() => selectMode('BREEZE')}>
              <CloudOutlined />
              <span>Gió nhẹ</span>
            </ModeButton>
          </Col>
          <Col span={6}>
            <ModeButton active={mode === 'Auto'} onClick={() => {handleAutoMode(fan.FAN_ID)}} >
              <RobotOutlined />
              <span>tự động /{fan?.Auto ? 'đang bật' : 'đang tắt'}</span>
              
            </ModeButton>
            
          </Col>
        </Row>
      </Card>
    </PageContainer>
  );
};

export default FanControlPage;

/* ================= STYLE ================= */

const PageContainer = styled.div`
  background: #f9f9f9;
  padding: 24px;
  max-width: 900px;
  margin: 40px auto;
`;

const SpeedWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 280px;
`;

const SpeedValue = styled.div`
  width: 36px;
  height: 28px;
  border-radius: 6px;
  background: #f0f5ff;
  color: #1677ff;
  font-weight: 600;
  text-align: center;
  line-height: 28px;
`;

const StyledSlider = styled(Slider)`
  flex: 1;
`;

const ModeButton = styled.div`
  background: ${({ active }) => (active ? '#e6f4ff' : '#fafafa')};
  border: 1px solid ${({ active }) => (active ? '#1677ff' : '#e5e7eb')};
  border-radius: 12px;
  padding: 14px;
  cursor: pointer;
  text-align: center;

  span {
    display: block;
    margin-top: 6px;
    font-size: 13px;
  }

  svg {
    font-size: 18px;
    color: ${({ active }) => (active ? '#1677ff' : '#595959')};
  }
`;
