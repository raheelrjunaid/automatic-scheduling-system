import { useState, useEffect } from 'react'
import { Modal, Button, Spin, Select, Switch, Form, Input, Table, Tag, message, Space } from 'antd'
import { PlusOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons'
import axios from 'axios'

export async function getAllEmployees(param=null) {
    try {
        const response = await axios.get("/api/employees")
        return param === "length" ? response.data.result.length : response.data.result
    } catch (error) {
        console.error(error)
    }
}

export default function Employees() {
    const [employees, setEmployees] = useState([])
    const [loading, setLoading] = useState(true)
    const [formLoading, setFormLoading] = useState(false);
    const [employeeEditing, setEmployeeEditing] = useState(null);
    const [modalVisibility, setModalVisibility] = useState(false);
    const [form] = Form.useForm();

    async function setAllEmployees() {
        setLoading(true)
        const data = await getAllEmployees()
        setEmployees(data.map((employee) => {
            return {
                key: employee._id,
                first_name: employee.first_name,
                last_name: employee.last_name,
                fixed_hours: employee.fixed_hours,
                colour: employee.colour
            }
        }))
        setLoading(false)
    }

    useEffect(() => {
        const controller = new AbortController()
        setAllEmployees()
        return () => controller.abort()
    }, [])

    function toggleModal(record) {
        setModalVisibility(!modalVisibility)
        if (modalVisibility) {
            setEmployeeEditing(null)
        }
        else if(record) {
            setEmployeeEditing(record)
            form.setFieldsValue(record)
        }
        else {
            form.resetFields()
            form.setFieldsValue({ colour: colours[0] })
        }
    }

    async function deleteEmployee(record) {
        try {
            await axios.delete(`/api/employees/${record.key}`)
            setAllEmployees()
        } catch (error) {
            error.errorFields.forEach(({errors}) => {
                message.error(errors)
            })
        }
    }

    async function handleSubmit() {
        try {
            setFormLoading(true)
            const data = await form.validateFields()
            if (!data.fixed_hours) data.fixed_hours = false
            if(employeeEditing) data._id = employeeEditing.key

            employeeEditing ? await axios.put('/api/employees', data) : await axios.post('/api/employees', data)
            setAllEmployees()
            setFormLoading(false)
            toggleModal()
        } catch (error) {
            console.error(error)
        }
    }

    const columns = [
        {
            title: 'First Name',
            dataIndex: 'first_name',
            key: 'first_name',
        },
        {
            title: 'Last Name',
            dataIndex: 'last_name',
            key: 'last_name',
        },
        {
            title: 'Colours',
            dataIndex: 'colour',
            key: 'colour',
            render: colour => <Tag color={colour}>{colour}</Tag>
        },
        {
            title: 'Fixed Hours',
            dataIndex: 'fixed_hours',
            key: 'fixed_hours',
            render: fixed_hours => fixed_hours ? <CheckOutlined /> : <CloseOutlined />
        },
        {
            title: 'Operate',
            dataIndex: 'operate',
            key: 'operate',
            render: (this_field, record) => (
                <>
                    <Space>
                        <Button type="default" onClick={() => toggleModal(record)}>Edit</Button>
                        <Button danger type="default" onClick={() => deleteEmployee(record)}>Delete</Button>
                    </Space>
                </>
            )
        }
    ]

    const colours = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"]

    return (
        <>
            <Spin spinning={loading}>
                <Table pagination={false} dataSource={employees} columns={columns} />
                <Button icon={<PlusOutlined />} type="primary" block onClick={() => toggleModal()}>Add New Employee</Button>
            </Spin>
            <Modal title="Edit employees" visible={modalVisibility} onCancel={() => toggleModal()} footer={[
                <Button type="default" onClick={() => toggleModal()}>Cancel</Button>,
                <Button type="primary" loading={formLoading} onClick={handleSubmit}>Submit</Button>,
            ]}>
                <Form form={form}>
                    <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
                        <Input placeholder="First Name"/>
                    </Form.Item>
                    <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
                        <Input placeholder="Last Name"/>
                    </Form.Item>
                    <Form.Item name="fixed_hours" label="Fixed Hours" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <Form.Item name="colour" label="Colour">
                        <Select style={{ width: 120 }}>
                            { colours.map((colour, indx) => (
                                <Select.Option key={indx} value={colour}><Tag color={colour}>{colour}</Tag></Select.Option>
                            ))
                            }
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}