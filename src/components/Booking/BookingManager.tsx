import React, { useState, useEffect } from "react";
import axios from 'axios'
import { Table, Row, Col, Form, Space, Popconfirm, Tag, Button, DatePicker, Select } from 'antd';

import type { ColumnsType } from "antd/es/table";
import { Modal } from "antd/es";
import moment from "moment";
import { DataType } from "./BookingType";
import dayjs, { Dayjs } from 'dayjs'
import { EmployeeType } from "../Employees/EmployeeType";


const url = "https://3d0d-210-245-110-144.ngrok-free.app";



const BookingManager = () => {
    interface BookingData {
        booking_id: number | undefined;
        time_start: Dayjs | null;
        time_end: Dayjs | null;
        employee_id: number[];
        room_id: number | undefined;
        employee_name: string[]

    }
    const storedRole = localStorage.getItem('role');

    const role: boolean = storedRole ? storedRole === 'true' : false;
    const [booking, setBooking] = useState([] as DataType[]);
    const [employees, setEmployees] = useState([] as EmployeeType[]);
    const token1 = localStorage.getItem('access_token');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // get data employees
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

    const getData = async () => {

        try {
            await axios.get(url + '/bookings', {
                withCredentials: true,
                headers: {
                    'ngrok-skip-browser-warning': 'any',
                    Authorization: `Bearer ${token1}`,
                },
            }).then(res => {

                setBooking(res.data.bookings)

            })

        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getData()

    }, [])
    const handleDelete = (id: number) => {
        axios
            .delete(url + "/bookings/" + id,
                {
                    headers: {
                        Authorization: `Bearer ${token1}`,
                    },
                }
            )
            .then((res) => {
                setBooking(res.data.bookings);
                alert("Reservation successfully deleted");
                window.location.reload();
            })
            .catch((er) =>
                console.log(er)
            );
    };
    const [bookingedit, setBookingEdit] = useState<DataType>();

    const handleToggleEdit = (booking: DataType) => {
        setIsModalOpen(true);
        setBookingEdit(booking);
        setBookingdata((prevBookingData) => ({
            ...prevBookingData,
            room_id: booking.room_id,
            employee_name: booking.employee_name,
            time_start: dayjs((booking.time_start)),
            time_end: dayjs((booking.time_end)),
            employee_id: booking.employee_id,


        }))
    };
    const [bookingdata, setBookingdata] = useState<BookingData>(
        {
            time_start: dayjs(bookingedit?.time_start),
            time_end: dayjs(bookingedit?.time_end),
            employee_id: [],
            room_id: bookingedit?.room_id,
            employee_name: [],
            booking_id: bookingedit?.booking_id
        }
    )
    // table
    const columns: ColumnsType<DataType> = [
        {
            align: 'center',
            title: "Room Name",
            key: 'room_name',
            dataIndex: "room_name",
        },
        {
            align: 'center',
            title: "Time Start",
            dataIndex: "time_start",
            key: 'time_start',
            render: (_, { time_start }) => {
                return moment(time_start).format("HH:mm DD-MM-YYYY ")
            }
        },
        {
            align: 'center',
            title: "Time End",
            dataIndex: "time_end",
            key: "time_end",
            render: (_, { time_end }) => {
                return moment(time_end).format("HH:mm DD-MM-YYYY ")
            }
        },
        {
            align: 'center',
            title: "Employees",
            dataIndex: "employee_name",
            key: "employee_name",
            render: (_, { employee_name }) => (
                <>
                    {employee_name.map((employee_name) => {
                        let color = employee_name.length > 3 ? 'pink' : 'green';
                        return (
                            <Tag color={color} key={employee_name}>
                                {employee_name.toUpperCase()}
                            </Tag>
                        );
                    })}
                </>
            ),
        },

        {
            align: 'center',
            title: "Action",
            key: "action",
            render: (_text, booking) =>
                (role === true) ? (
                    <Space size="middle">
                        <a onClick={() => handleToggleEdit(booking)}>Edit</a>
                        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(booking.booking_id)}>
                            <a>Delete</a>
                        </Popconfirm>
                    </Space>
                ) : ("You aren't an admin !! ")
        }
    ];
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    const handleBookingDataChange = (name: keyof BookingData, value: Dayjs | null) => {
        setBookingdata(prevData => ({
            ...prevData,
            [name]: dayjs(value),
        }))
    }
    const handleEmployeeSelection = (employeeId: number[]) => {
        setBookingdata(prevData => ({
            ...prevData,
            employee_id: employeeId,
        }));
    };

    const handleUpdate = async (values: any) => {
        const formattedBookingData = {
            ...bookingdata,
            time_start: bookingdata.time_start!.format(),
            time_end: bookingdata.time_end!.format()

        };
        axios.put(url + '/bookings/' + bookingedit?.booking_id, formattedBookingData, {
            withCredentials: true,
            headers: {
                Authorization: `Bearer ${token1}`,
            },
        }).then((res) => {
            setBooking(res.data.booking);
            alert("Successfully edited booking infomations ");
            window.location.reload()
        }).catch((error) => {
            alert(error.response.data.error)
        });

    };
    const dateFomat = 'DD-MM-YYYY HH:mm:ss'
    return (

        <div>
            <Table columns={columns} dataSource={booking} />
            <Modal
                title="Edit Booking Information"
                open={isModalOpen}
                onCancel={handleCancel}
                destroyOnClose={true}
                style={{ width: "500px", textAlign: "center" }}
                footer={[]}
            >
                <div style={{ padding: 20 }}>
                    <Form layout='vertical' initialValues={bookingdata}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    label='Start time'
                                    name='time_start'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select a start time',
                                        },

                                    ]}
                                >
                                    <DatePicker
                                        showTime
                                        format={dateFomat}
                                        name='time_start'
                                        onChange={(date, dateString) =>
                                            handleBookingDataChange('time_start', date)
                                        }
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label='Time end'
                                    name='time_end'
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please select a start end',
                                        },
                                    ]}

                                >
                                    <DatePicker
                                        showTime
                                        name='time_end'
                                        format={dateFomat}
                                        onChange={(date, dateString) =>
                                            handleBookingDataChange('time_end', date)
                                        }

                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Col span={12}>
                            <Form.Item label='Employees'
                                name='employee_id'
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please select employee',
                                    },
                                ]}>
                                <Select
                                    placeholder='Select employee'
                                    mode='multiple'
                                    onChange={handleEmployeeSelection}
                                >
                                    {employees.map(employee => (
                                        <Select.Option key={employee.employee_name} label={employee.employee_name} value={employee.employee_id}>
                                            {employee.employee_name}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>

                        <Button type='primary' htmlType='submit' onClick={handleUpdate}>
                            Update
                        </Button>
                    </Form>
                </div>
            </Modal>



        </div>

    )
}
export default BookingManager

