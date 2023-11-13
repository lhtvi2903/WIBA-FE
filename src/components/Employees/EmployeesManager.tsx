import React, { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Form, FormInstance, Input, Modal, Popover, Space } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { EmployeeType } from "./EmployeeType";
import AddEmployee from "./AddEmployees";

const { Meta } = Card;
const url = "https://3d0d-210-245-110-144.ngrok-free.app";

const EmployeesManager = () => {
  const [employees, setEmployees] = useState([] as EmployeeType[]);
  const [employee_name, setEditName] = useState("");
  const [email, setEditEmail] = useState("");
  const [employee_number, setEditNumber] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  const token1 = localStorage.getItem('access_token');

  useEffect(() => {
    axios
        .get(url + "/employees", {
            withCredentials: true,
            headers: {
                'ngrok-skip-browser-warning': 'any',
                Authorization: `Bearer ${token1}`,
            },
        })
        .then((res) => {
            setEmployees(res.data.employees);
        });
}, []);

  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType>();

  const handleDelete = (id: any) => {
    if (selectedEmployee) {
      const { employee_id } = selectedEmployee;
      axios
        .delete(url + "/employees/" + employee_id,
          {
            headers: {
              Authorization: `Bearer ${token1}`
            }
          }).then((res) => {
            setEmployees(res.data.employee);
            window.location.reload();
          })
        .catch((error) => {

          alert(error.response.data.message);

        });

    }
  };

  const handleUpdate = () => {
    if (selectedEmployee) {
      const { employee_id } = selectedEmployee;
      axios
        .put(url + "/employees/" + employee_id, {
          employee_name,
          email,
          phone_number: employee_number,
        },
          {
            headers: {
              Authorization: `Bearer ${token1}`
            }
          }).then((res) => {
            setEmployees(res.data.employee);
            alert("Successfully edited employees");
            window.location.reload();
          })
        .catch((error) => {

          alert(error.response.data.error);

        });

    }
  };
  const handleToggleDelete = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setIsModalDeleteOpen(true);


  }

  const handleToggleEdit = (employee: EmployeeType) => {
    setSelectedEmployee(employee);
    setEditName(employee.employee_name);
    setEditEmail(employee.email);
    setEditNumber(employee.phone_number);
    setIsModalOpen(true);
  };

  const onchangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditName(e.target.value);
  };

  const onchangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditEmail(e.target.value);
  };

  const onchangephone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditNumber(e.target.value);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setIsModalDeleteOpen(false)
  };
  const [form] = Form.useForm();

  const UpdateButton = ({ form }: { form: FormInstance }) => {
    const [updatetable, setUpdatetable] = useState(false);
    const values = Form.useWatch([], form);
    React.useEffect(() => {
      form.validateFields({ validateOnly: true }).then(
        () => {
          setUpdatetable(true);
        },
        () => {
          setUpdatetable(false);
        },
      );
    }, [values]);
    return (
      <Button type="primary" htmlType="submit" onClick={handleUpdate} disabled={!updatetable}>
        Submit
      </Button>
    );
  };


  return (
    <>
      <div className="container">
        <AddEmployee />

        <div className="grid-container">
          {employees.map((employee) => {
            return (
              <Card
                hoverable
                className="grid-item"
                key={employee.employee_id}
                style={{
                  width: 300, margin: "auto", borderRadius: 10, marginTop: 15, border: '2px solid #dadada',
                }}
                actions={[
                  
                    <Space  style={{width: '100%', justifyContent:'center',columnGap:'50%'}}>
                    <Popover content="Edit Employee">
                      <EditOutlined onClick={() => handleToggleEdit(employee)} />
                    </Popover>
                    <Popover content='Delete Employee'>
                      <DeleteOutlined style={{ color: "#ff4d4f" }} onClick={() => handleToggleDelete(employee)} />
                    </Popover>
                  </Space>,
                 
                ]}
              >
                <Meta
                  title={employee.employee_name}
                  description={
                    <>
                      {employee.email} <br /> {employee.phone_number}
                    </>
                  }
                />
              </Card>
            );
          })}
        </div>
      </div>

      <Modal
        title="Edit Employee Information"
        open={isModalOpen}
        destroyOnClose={true}
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
            colon={false}
            style={{ maxWidth: 600 }}
            initialValues={selectedEmployee}
          >
            <Form.Item label="Name" name="employee_name"
              rules={[{ required: true, message: 'Please input your name!' },
              { whitespace: true }
              ]} hasFeedback
            >
              <Input
                onChange={onchangeName} required
              />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[
              { required: true, message: 'Please input your email!' },
              {
                pattern: /^[\w-]+(\.[\w-]+)*@hotmail\.com$|^[\w-]+(\.[\w-]+)*@outlook\.com$|^[\w-]+(\.[\w-]+)*@gmail\.com$/,
                message: 'Please enter a valid email address!'
              },
              { whitespace: true }
            ]} hasFeedback
            >

              <Input
                onChange={onchangeEmail} required />
            </Form.Item>

            <Form.Item label="Phone Number" name="phone_number"
              rules={[
                { required: true },
                {
                  pattern: new RegExp("^[0-9]*$"),
                  message: 'Please enter a valid phone number!'
                },

                { whitespace: true }

              ]} hasFeedback
            >
              <Input
                pattern="[0-9]{1,10}"
                maxLength={10}
                onChange={onchangephone}
                required
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <UpdateButton form={form} />
              </Space>
            </Form.Item>
          </Form>
        </div>
      </Modal>

      <Modal
        title="Delete this employee"
        open={isModalDeleteOpen}
        onOk={handleDelete}
        onCancel={handleCancel}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>Confirm delete this employee ??</p>
      </Modal>
    </>
  );
};

export default EmployeesManager;
