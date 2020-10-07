import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, PageHeader, Button, Tooltip, Input, Modal, TimePicker, Form, Select, message } from 'antd';
import { PlusOutlined, SearchOutlined, FormOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { reactLocalStorage } from 'reactjs-localstorage';
import './style.todo.css';

const { Option } = Select;

const Content = () => {

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    };

    const [openEdit, setOpenEdit] = useState(false);
    const [actionEdit, setActionEdit] = useState('Add');
    const [titleEdit, setTitleEdit] = useState('Add a todo');
    const [dataLocal, setDataLocal] = useState([]);

    useEffect(() => {
        setDataLocal(JSON.parse(reactLocalStorage.get('todo_lists')) || []);
    }, [])

    // function edit
    const fnOpenEdit = (val) => {
        setOpenEdit(val);
        if (actionEdit === 'Add') setTitleEdit('Add a todo')
        else setTitleEdit('Edit todo list')
    }

    // function create
    const onCreate = (values) => {
        if (actionEdit === 'Add') {
            const key = moment().valueOf();
            const _values = { ...values, key };
            const _dataLocal = [_values, ...dataLocal];
            setDataLocal(_dataLocal);
            saveLocal(_dataLocal);
        }
        else
            console.log(values);
    }

    // hàm lưu dữ liệu vào local tham số truyền vào là  data
    const saveLocal = (data) => {
        reactLocalStorage.setObject('todo_lists', data);
    }

    const Edit = () => {
        const [form] = Form.useForm();
        return (
            <Modal
                title={titleEdit}
                visible={openEdit}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            form.resetFields();
                            onCreate(values);
                            fnOpenEdit(false);
                        })
                        .catch(() => {
                            message.error('Please input your Fields:');
                        });
                }}
                onCancel={() => {
                    fnOpenEdit(false)
                }}
            >
                <Form
                    form={form}
                    {...layout}
                >
                    <Form.Item
                        label="Time"
                        name="time"
                        rules={[{ required: true, message: 'Please select your time !' }]}
                    >
                        <TimePicker />
                    </Form.Item>

                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{ required: true, message: 'Please input your name!' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Level"
                        name="level"
                        rules={[{ required: true, message: 'Please input your level!' }]}
                    >
                        <Select>
                            <Option value="low">Low</Option>
                            <Option value="medium">Medium</Option>
                            <Option value="high">High</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true, message: 'Please input your status!' }]}
                    >
                        <Select>
                            <Option value="notDone">Not done</Option>
                            <Option value="done">Done</Option>
                        </Select>

                    </Form.Item>
                </Form>
            </Modal>
        )
    }

    // function delete
    const Delete = () => {

    }

    // function header
    const Header = () => (
        <PageHeader
            className="header-table"
            title={
                <Input placeholder="Search..."
                    style={{ width: 360 }}
                    suffix={<Tooltip title="Looking for a todo"><SearchOutlined /></Tooltip>}
                />
            }
            extra={[
                <Tooltip title="Click here to add a new todo" key="1" >
                    <Button type="primary" icon={<PlusOutlined />}
                        onClick={() => {
                            fnOpenEdit(true);
                            setActionEdit('Add');
                        }}>
                        Add new todo
                </Button>
                </Tooltip>
            ]}
        />)

    const columns = [
        {
            title: '#',
            width: 35,
            render: (text, record) => (dataLocal.indexOf(record) + 1)
        },
        {
            title: 'Time',
            dataIndex: 'time',
            width: 120,
            key: 'age',
            render: (text) => (
                <p style={{margin: "0px"}}><ClockCircleOutlined /> {moment(text).format("HH:mm:ss")}</p>
            )
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <b>{text}</b>,
        },
        {
            title: 'Level',
            width: 50,
            dataIndex: 'level',
            key: 'level',
            render: text => (
                <>
                    {text === "high" && <Tag color="warning">High</Tag>}
                    {text === "medium" && <Tag color="processing">Medium</Tag>}
                    {text === "low" && <Tag color="default">Low</Tag>}
                </>
            )
        },
        {
            title: 'Status',
            key: 'status',
            width: 35,
            dataIndex: 'status',
            render: text => (
                <>
                    {text === "notDone" && <Tag color="error">Not done</Tag>}
                    {text === "done" && <Tag color="success">Done</Tag>}
                </>
            )
        },
        {
            title: 'Action',
            key: 'action',
            width: 120,
            align: 'center',
            render: (text, record) => (
                <Space size="middle">
                    <Button type="primary" ghost size="small" icon={<FormOutlined />}>Edit</Button>
                    <Button size="small" danger icon={<DeleteOutlined />}>Delete</Button>
                </Space>
            ),
        },
    ];

    const data = [
        {
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
            tags: ['nice', 'developer'],
        },
        {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
            tags: ['loser'],
        },
        {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
            tags: ['cool', 'teacher'],
        },
    ];
    return (
        <div>
            <Table
                columns={columns}
                dataSource={dataLocal}
                bordered={true}
                title={() => <Header />}
            />
            <Edit />
        </div>
    );
};

export default Content;