import { useState, useEffect } from 'react'
import { Modal, Button, Spin, Select, Switch, Form, Input, Table, Tag, message } from 'antd'
import { CloseOutlined, CheckOutlined } from '@ant-design/icons'
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
    const [modalVisibility, setModalVisibility] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const controller = new AbortController()
        async function setAllEmployees() {
            const data = await getAllEmployees()
            setEmployees(data.map((employee, indx) => {
                return {
                    key: indx,
                    first_name: employee.first_name,
                    last_name: employee.last_name,
                    fixed_hours: employee.fixed_hours,
                    colour: employee.colour
                }
            }))
            setLoading(false)
        }
        setAllEmployees()
        return () => controller.abort()
    }, [])

    function toggleModal() {
        setModalVisibility(!modalVisibility)
    }

    async function handleSubmit() {
        try {
            const fields = await form.validateFields()
            console.log(fields)
            toggleModal()
        } catch (error) {
            error.errorFields.forEach(({errors}) => {
                message.error(errors)
            })
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
            title: 'Edit',
            dataIndex: 'edit',
            key: 'edit',
            render: _ => <Button type="default" onClick={toggleModal}>Edit</Button>
        }
    ]

    const colours = ["magenta", "red", "volcano", "orange", "gold", "lime", "green", "cyan", "blue", "geekblue", "purple"]

    return (
        <>
            <Spin spinning={loading}>
                <Table pagination={false} dataSource={employees} columns={columns} />
            </Spin>
            <Modal title="Edit employees" visible={modalVisibility} onOk={toggleModal} onCancel={toggleModal} footer={[
                <Button type="default" onClick={toggleModal}>Cancel</Button>,
                <Button type="primary" onClick={handleSubmit}>Submit</Button>,
            ]}>
                <Form form={form} initialValues={{ colour: colours[0] }}>
                    <Form.Item name="first-name" label="First Name" rules={[{ required: true }]}>
                        <Input placeholder="First Name"/>
                    </Form.Item>
                    <Form.Item name="last-name" label="Last Name" rules={[{ required: true }]}>
                        <Input placeholder="Last Name"/>
                    </Form.Item>
                    <Form.Item name="fixed-hours" label="Fixed Hours">
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