import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Input, Button, Modal, FormInstance, Space } from "antd";
import { EmployeeType } from "./EmployeeType";
const url = "https://3d0d-210-245-110-144.ngrok-free.app";


const AddEmployee = () => {
  const [employees, setEmployees] = useState([] as EmployeeType[]);
  const [employee_name, setAddName] = useState("");
  const [email, setAddEmail] = useState("");
  const [phone_number, setAddNumber] = useState(" ");
  const [password, setAddpass] = useState(" ");
  // const [errors, setErrors] = useState<Record<string, string>>({});
  const token1 = localStorage.getItem('access_token');




  useEffect(() => {
    axios
      .get(url + "/employees", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token1}`,
        },
      })
      .then((res) => {
        setEmployees(res.data.employees);
      });
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const SubmitButton = ({ form }: { form: FormInstance }) => {
    const [submittable, setSubmittable] = useState(false);
    const values = Form.useWatch([], form);
    React.useEffect(() => {
      form.validateFields({ validateOnly: true }).then(
        () => {
          setSubmittable(true);
        },
        () => {
          setSubmittable(false);
        },
      );
    }, [values]);
    return (
      <Button type="primary" htmlType="submit" onClick={handleSubmit} disabled={!submittable}>
        Submit
      </Button>
    );
  };


  const handleSubmit = () => {

    axios
      .post(url + "/employees", {
        employee_id: employees.length + 1,
        employee_name,
        email,
        phone_number,
        password
      }, {
        headers: {
          Authorization: `Bearer ${token1}`,
        }

      }).then((res) => {
        setEmployees(res.data.employees);
        alert('Successfully added new employees')
        setIsModalOpen(false);
        window.location.reload()
      })
      .catch((error) => {
        alert(error.response.data.error);

      });


  };

  const onchangeName = (e: any) => {
    setAddName(e.target.value)
  }
  const onchangeEmail = (e: any) => {
    setAddEmail(e.target.value)
  }
  const onchangephone = (e: any) => {
    setAddNumber(e.target.value)
  }
  const onchangepass = (e: any) => {
    setAddpass(e.target.value)
  }

  const showModal = () => {
    setIsModalOpen(true);
  };

  

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const [form] = Form.useForm();

  return (
    <>
      <Button onClick={showModal}>
        Add employee
      </Button>
      <Modal
        title="Employee Infomation"
        
        open={isModalOpen}
        footer={[]}
        onCancel={handleCancel}
        style={{ width: "500px", textAlign: "center" }}
      >
        <div style={{ padding: 20 }}>
          <Form
            name="validateOnly"
            labelCol={{ flex: "150px" }}
            labelAlign="left"
            form={form}
            wrapperCol={{ flex: 1 }}
            style={{ maxWidth: 600 }}
          >
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Name is required" },
                { whitespace: true }
              ]}
            >
              <Input
                placeholder="Employee Name"
                onChange={onchangeName} required />
            </Form.Item>

            <Form.Item label="Email" name="email" rules={[
              { required: true, message: 'Please input email!' },
              { type: 'email', message: 'Invalid email format' },
              { whitespace: true }


            ]} hasFeedback
            
            >
              <Input
                placeholder='Email'
                onChange={onchangeEmail} required />
            </Form.Item>
            <Form.Item
              label="Phone Number"
              name="number"
              rules={[
                { required: true, message: 'Please input phone-number!' },
                { whitespace: true },
                {
                  pattern: /^\d+$/,
                  message: "Please input number!"
                }
              ]} hasFeedback
             
            >
              <Input placeholder="Number" pattern="[0-9]{1,10}" type="tel" maxLength={10} onChange={onchangephone} required />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true, message: 'Please input phone-number!' }]} hasFeedback
              
            >
              <Input placeholder="Password" value={password} type="password" onChange={onchangepass} required />
            </Form.Item>
            <Form.Item>
              <Space>
                <SubmitButton form={form} />
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>

    </>
  );
};

export default AddEmployee;