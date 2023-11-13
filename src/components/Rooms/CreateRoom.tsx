import React, { useState } from 'react';
import { Form, Input, Button, Modal } from 'antd';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const url = 'https://3d0d-210-245-110-144.ngrok-free.app';
const CreateRoom: React.FC = () => {
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState<string>('');
  const token1 = localStorage.getItem('access_token');
  const [error, setError] = useState<string>('');
  const [errorVisible, setErrorVisible] = useState(false);
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      await axios.post(
        `${url}/rooms`,
        { room_name: roomName },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Server: 'Werkzeug/3.0.0 Python/3.12.0',
            'cache-control': 'no-cache,private',
            Authorization: `Bearer ${token1}`,
          },
        }
      );
      navigate('/home');
    } catch (err: any) {
      setErrorVisible(true);
      setError(err.response.data.error);
    }
    setRoomName('');
  };

  return (
    <>
      <Form layout='inline'>
        <Form.Item
        rules={[{ required: true, message: 'Please input room name!' },
        { whitespace: true }
      
      ]}>
          <Input
            type='text'
            placeholder='Enter room'
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Button
            onClick={handleSubmit as any}
            type='primary'
            htmlType='submit'
          >
            Add
          </Button>
        </Form.Item>
      </Form>
      <Modal
        title='Lỗi'
        open={errorVisible}
        onCancel={() => setErrorVisible(false)}
        footer={[
          <Button
            key='ok'
            type='dashed'
            onClick={() => setErrorVisible(false)}
          >
            OK
          </Button>,
        ]}
      >
        <p>{error}</p>
      </Modal>
    </>
  );
};

export default CreateRoom;
