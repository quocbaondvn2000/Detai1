import React, { useState, useEffect } from 'react';
import { Table, Tag, Space, PageHeader, Button, Tooltip, Input, Modal, TimePicker, Form, Select, message } from 'antd';
import { PlusOutlined, FormOutlined, DeleteOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import moment from 'moment';
import { reactLocalStorage } from 'reactjs-localstorage';
import './style.todo.css';

const { Option } = Select;
const { confirm } = Modal;
const { Search } = Input;

const Content = () => {

    const format = 'HH:mm';

    const layout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 },
    };

    const [openEdit, setOpenEdit] = useState(false);
    const [actionEdit, setActionEdit] = useState('Add');
    const [titleEdit, setTitleEdit] = useState('Edit a todo');
    const [dataLocal, setDataLocal] = useState([]);
    const [filterTable, setFilterTable] = useState(null);
    const [dataEdit, setDataEdit] = useState({});
    const [valueFilter, setValueFilter] = useState("");

    useEffect(() => {
        const todo_list = reactLocalStorage.get('todo_lists');
        if(todo_list){
            // console.log(todo_list);
            setDataLocal(JSON.parse(todo_list));
        }else{
            setDataLocal([]);
        }
    }, [])

    // function edit
    const fnOpenEdit = (val) => {
        setOpenEdit(val);     
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
        else {
            const newArray = dataLocal.map((item) => {
                if (item.key === dataEdit.key) {
                    return { key: item.key, ...values };
                } else {
                    return item;
                }
            });
            setDataLocal(newArray);
            saveLocal(newArray);
            // console.log(newArray);
        }
    }

    // hàm lưu dữ liệu vào local tham số truyền vào là  data
    const saveLocal = (data) => {
        reactLocalStorage.setObject('todo_lists', data);
    }

    const Header = () => {
        // const [valueFilter, setValueFilter] = useState("");

        const onSearch = value => {
            const _filterTable = dataLocal.filter(o =>
                Object.keys(o).some(k =>
                    String(o[k])
                        .toLowerCase()
                        .includes(value.toLowerCase())
                )
            );
            setFilterTable(_filterTable);
        };

        return (
            <PageHeader
                className="header-table"
                title={
                    <Search
                        autoFocus
                        onChange={e => setValueFilter(e.target.value)}
                        value={valueFilter}
                        placeholder="Search in todo list"
                        onSearch={value => onSearch(value)}
                        style={{ width: 360 }}
                        allowClear={true}
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
    }


    const Edit = () => {
        const [form] = Form.useForm();

        useEffect(() => {
            if (actionEdit === "Edit" && openEdit === true) {
                setTitleEdit('Edit a todo');
                // console.log(dataEdit);
                form.setFieldsValue({
                    time: moment(dataEdit.time, format),
                    key: dataEdit.key,
                    level: dataEdit.level,
                    name: dataEdit.name,
                    status: dataEdit.status
                });
            } else {
                setTitleEdit('Add todo list');
                form.resetFields();
            }

        }, [openEdit, actionEdit, dataEdit])

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
                        <TimePicker format={format} />
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
    const onDelete = (key) => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            content: <label>Bạn có chắc xóa dữ liệu này không?</label>,
            onOk() {
                const newArray = dataLocal.filter(item => item.key !== key);
                setDataLocal(newArray);
                saveLocal(newArray);
            },
        });
    };

    const columns = [
        {
            title: '#',
            width: 35,
            render: (text, record) => (dataLocal.indexOf(record) + 1),
        },
        {
            title: 'Time',
            dataIndex: 'time',
            width: 120,
            key: 'time',
            render: (text) => (
                <p style={{ margin: "0px" }}><ClockCircleOutlined /> {moment(text).format("HH:mm")}</p>
            ),
            sorter: (a, b) => moment(a.time).unix() - moment(b.time).unix(),
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            render: text => <b>{text}</b>,
            sorter: (a, b) => a.name.length - b.name.length,
            sortDirections: ['descend', 'ascend'],
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
                    <Button type="primary" ghost size="small" icon={<FormOutlined />}
                        onClick={() => {
                            fnOpenEdit(true);
                            setActionEdit('Edit');
                            setDataEdit(record);
                        }}
                    >Edit</Button>
                    <Button size="small" danger icon={<DeleteOutlined />}
                        onClick={() => onDelete(record.key)}
                    >Delete</Button>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Table
                columns={columns}
                dataSource={filterTable === null ? dataLocal : filterTable}
                bordered={true}
                title={() => <Header />}
            />
            <Edit />
        </div>
    );
};

export default Content;