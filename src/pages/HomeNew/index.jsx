import { Flex } from "antd";
import { useEffect, useState } from "react";
import styled from "styled-components";
import IoTServices from "../../services/IoTServices";
import { useQuery } from "@tanstack/react-query";

export default function FanControl() {
 
  const [loading, setLoading] = useState(false);
const toggleFan = true ; 
 const [fanState, setFanState] = useState("tắt");
  const [speed, setSpeed] = useState(50);
  const [temperature] = useState(28);
  const [threshold, setThreshold] = useState(30);
 const [mode, setMode] = useState("manual");

 const GetDeviceInformation =  async () => {
  try{
    const res = await IoTServices.GetDeviceInformation();
    
    console.log('res', res)
    return res.data ;
  }catch{
   return  ;
  }
}
const { isLoading, data: IoTdevice, isError } =
  useQuery({
    queryKey: ["IoTdevice"],
    queryFn: GetDeviceInformation,
  });

if (isLoading) return <p>Đang tải dữ liệu...</p>;
if (isError) return <p>Lỗi lấy dữ liệu</p>;
  return (
   <CardWrapper>
      <Card>
        <h2>🌀thông tin quạt </h2>
        <p>tên quạt :{IoTdevice.name}</p>
        <p>trạng thái quạt :{IoTdevice.status}  </p>
        <p>nhiệt độ   :{IoTdevice.temperatureSensor} °C   </p>
        <p>ngưỡng {IoTdevice.thresholdValue}00 vòng/s:</p>
      </Card>

<Card>
      <h2>🌀 Điều khiển quạt</h2>

      

      <Button
        className={fanState === "bật" ? "off" : "on"}
        onClick={() =>
          setFanState(fanState === "bật" ? "tắt" : "bật")
        }
      >
        {fanState === "bật" ? "TẮT QUẠT" : "BẬT QUẠT"}
      </Button>

      <Section>
  <label>🌪️ Tốc độ quạt</label>

  <SpeedControl>
    <button onClick={() => setSpeed(Math.max(speed - 1, 0))}>
      ➖ NHỎ
    </button>

    <span>{speed}</span>

    <button onClick={() => setSpeed(Math.min(speed + 1, 5))}>
      ➕ TO
    </button>
  </SpeedControl>
</Section>

      

      <Section>
        <label> cảnh báo </label>
        <p>thiết  bị hoạt động  bình thường </p>
      </Section>

      <Section>
  <label>🎛️ Chọn chế độ</label>

  <ModeGroup>
    <ModeButton
      active={mode === "manual"}
      onClick={() => setMode("manual")}
    >
       Thủ công
    </ModeButton>

    <ModeButton
      active={mode === "auto"}
      onClick={() => setMode("auto")}
    >
       Làm lạnh nhanh
    </ModeButton>

    <ModeButton
      active={mode === "night"}
      onClick={() => setMode("night")}
    >
      Tự động 
    </ModeButton>
  </ModeGroup>
</Section>
    </Card>

  
      <Card>
        <h2>🌀 </h2>
      </Card>
    </CardWrapper>
  );
}
const CardWrapper = styled.div`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap; /* responsive */
`;

const Card = styled.div`
  width: 400px;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0,0,0,.15);
  text-align: heght;
  font-family: sans-serif;
`;


const Status = styled.p`
  margin: 12px 0;
  font-size: 18px;

  span {
    margin-left: 8px;
    font-weight: bold;
  }

  .on { color: #2ecc71; }
  .off { color: #e74c3c; }
`;

const Button = styled.button`
  width: 100%;
  padding: 12px;
  border-radius: 8px;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &.on { background: #2ecc71; }
  &.off { background: #e74c3c; }
`;

const Section = styled.div`
  margin-top: 20px;
  text-align: left;

  input {
    width: 100%;
    margin-top: 6px;
    padding: 6px;
  }
`;

const SpeedControl = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 10px;

  span {
    font-size: 20px;
    font-weight: bold;
  }

  button {
    padding: 8px 14px;
    font-size: 16px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    background: #3498db;
    color: white;
  }

  button:hover {
    opacity: 0.9;
  }
`;
const ModeGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const ModeButton = styled.button`
  flex: 1;
  padding: 10px 6px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 14px;

  background: ${({ active }) => (active ? "#9b59b6" : "#ecf0f1")};
  color: ${({ active }) => (active ? "white" : "#333")};
`;