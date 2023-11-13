import React, { useState } from 'react';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { setAuthData } from '../reducers/authSlice';
import { useNavigate } from 'react-router-dom';
interface User {
  sub: number;
  role: boolean;
}



const url: string = 'https://3d0d-210-245-110-144.ngrok-free.app';
const FormLogin: React.FC = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    await axios
      .post(url + '/login', values, {
        withCredentials: true,
      })
      .then(res => {
        localStorage.setItem('access_token', res.data);
        const token: string = res.data.access_token;
        const decodedToken = jwtDecode(token) as User;
        const role: boolean = decodedToken.role;
        
        localStorage.setItem('access_token', token);
        localStorage.setItem('role', String(role));
        // dispatch(setAuthData({ role, token }));
        
        if(role === true){
          navigate('/home');
        }else if(role === false){
          navigate('/');
        }
      })
      .catch(message => {
        alert(message);
      });
    setLoading(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    setErrors(
      errorInfo.errorFields.reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.name[0]] = curr.errors[0];
        return acc;
      }, {})
    );
  };
  return (
    <>
      <div
        style={{
          maxWidth: '400px',
          margin: '0 auto',
          marginTop: '100px',
          // border: '1px solid black',
          padding: '2rem',
          borderRadius: '3rem',
          backgroundColor: '#DBE0E7'
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>
          Form Login
        </h1>
        <p style={{ textAlign: 'center', marginBottom: '20px' }}>
          Welcome to RikkeiSoft
        </p>
        <Form form={form} onFinish={onFinish} onFinishFailed={onFinishFailed}>
          <Form.Item
            name='email'
            rules={[
              { required: true, message: 'Email is required' },
              { type: 'email', message: 'Invalid email format' },
            ]}
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email}
          >
            <Input
              prefix={<MailOutlined style={{ marginRight: '10px' }} />}
              placeholder='Email'
              style={{ padding: '16px', fontSize: '16px' ,outline:'none',border:'none'}}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            name='password'
            rules={[{ required: true, message: 'Password is required' }]}
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password}
          >
            <Input.Password
              prefix={<LockOutlined style={{ marginRight: '10px' }} />}
              placeholder='Password'
              style={{ padding: '16px', fontSize: '16px',outline:'none',border:'none' }}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item style={{ fontSize: '20px' }}>
            <Button
              type='primary'
              htmlType='submit'
              style={{ width: '100%' }}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};

export default FormLogin;
