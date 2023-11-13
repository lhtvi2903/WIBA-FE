import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Select,
  Button,
  DatePicker,
  Form,
  Row,
  Col,
  Typography,
  Alert,
  Space,
  Card,
} from 'antd';
import dayjs, { Dayjs } from 'dayjs';

const { Option } = Select;
const { Title } = Typography;

const url = "https://3d0d-210-245-110-144.ngrok-free.app";


interface Employee {
  employee_id: number;
  employee_name: string;
}

interface Room {
  room_id: number;
  room_name: string;
}

interface BookingData {
  room_id: number;
  time_start: Dayjs;
  time_end: Dayjs;
  employee_id: number[];
}

const BookingFormPage: React.FC<{ selectedRoom: Room | null }> = ({
  selectedRoom,
}) => {
  const history = useNavigate();
  const [currentTime, setCurrentTime] = useState('');
  const [bookingData, setBookingData] = useState<BookingData>({
    room_id: selectedRoom?.room_id || 0,
    time_start: dayjs(),
    time_end: dayjs(),
    employee_id: [],
  });
  const [employees, setEmployees] = useState<Employee[]>([]);
  const token = localStorage.getItem('access_token');
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get<{ employees: Employee[] }>(
        url + '/employees',
        {
          withCredentials: true,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'ngrok-skip-browser-warning': 'any',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Ngrok-Trace-Id': 'bc47d5235e969cbcdd63082f9efdeb9c',
            Server: 'Werkzeug/3.0.0 Python/3.12.0',
            'cache-control': 'no-cache,private',
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEmployees(response.data.employees);
    } catch (error : any) {
      setErrorMessage(error.response.data.error);
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 3000);
    }

    const currentTime = new Date().toLocaleString();
    setCurrentTime(currentTime);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (selectedRoom) {
      setBookingData(prevData => ({
        ...prevData,
        room_id: selectedRoom.room_id,
      }));
    }
  }, [selectedRoom]);

  const handleBookingDataChange = (
    name: keyof BookingData,
    value: Dayjs | null
  ) => {
    if (value !== null) {
      setBookingData(prevData => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleEmployeeSelection = (employeeId: number[]) => {
    setBookingData(prevData => ({
      ...prevData,
      employee_id: employeeId,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formattedBookingData = {
        ...bookingData,
        time_start: bookingData.time_start.format(),
        time_end: bookingData.time_end.format(),
      };

      await axios.post(url + '/bookings', formattedBookingData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Booking success');
      history('/bookingmanagement');
    } catch (error: any) {
      setErrorMessage(error.response.data.error);
      setErrorVisible(true);
      setTimeout(() => {
        setErrorVisible(false);
      }, 3000);
    }
  };
  const handleFormSubmit = () => {
    handleSubmit();
  };
return (
    <div
      style={{ display: 'flex', justifyContent: 'center', maxHeight: '100vh' }}
    >
      <Card
        style={{
          width: '500px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
      >
        <Space direction='vertical' size='middle'>
          <Title
            level={2}
            style={{ display: 'flex', justifyContent: 'center' }}
          >
            Đặt phòng
          </Title>
          {errorVisible && (
            <Alert message={errorMessage} type='error' closable />
          )}
          <p style={{ fontSize: '18px' }}>
            Phòng đã chọn: {selectedRoom?.room_name}
          </p>
          <p>Ngày hiện tại: {currentTime}</p>

          <Form layout='vertical' onFinish={handleFormSubmit}>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label='Thời gian bắt đầu'
                  name='time_start'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn thời gian bắt đầu',
                    },
                  ]}
                >
                  <DatePicker
                    showTime
                    name='time_start'
                    value={bookingData.time_start}
                    onChange={(date, dateString) =>
                      handleBookingDataChange('time_start', date)
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label='Thời gian kết thúc'
                  name='time_end'
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng chọn thời gian kết thúc',
                    },
                  ]}
                >
                  <DatePicker
                    showTime
                    name='time_end'
                    value={bookingData.time_end}
                    onChange={(date, dateString) =>
                      handleBookingDataChange('time_end', date)
                    }
                  />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              label='Nhân viên'
              name='employee_id'
              required
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn nhân viên',
                },
              ]}
            >
              <Select
                placeholder='Chọn nhân viên'
                onChange={handleEmployeeSelection}
                value={bookingData.employee_id}
                mode='multiple'
              >
                {employees.map(employee => (
                  <Option
                    key={employee.employee_id}
                    value={employee.employee_id}
                  >
                    {employee.employee_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type='primary' htmlType='submit'>
                Đặt phòng
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </div>
  );
};

export default BookingFormPage;
