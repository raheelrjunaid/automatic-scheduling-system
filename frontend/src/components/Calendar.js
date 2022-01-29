import { useState, useEffect } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'
import objectSupport from 'dayjs/plugin/objectSupport'
import { Skeleton, message, Tooltip, Button, Badge, Typography, Row, Col, Form, Popover, InputNumber, TimePicker, Space } from 'antd'
import 'antd/dist/antd.css'
import { EditOutlined, LeftOutlined, DoubleLeftOutlined, DoubleRightOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons'
import moment from 'moment'

dayjs.extend(objectSupport);

async function getAllEmployees() {
    try {
        const response = await axios.get("/api/employees")
        message.success({'content': response.data.message, key: 'get_all_employees'})
        return response.data.result.length
    } catch (error) {
        message.error({'content': error.response.data.message, key: 'get_all_employees'})
    }
}

const allEmployeesLength = getAllEmployees()

export default function Calendar() {
    const [month, setMonth] = useState(dayjs())

    function changeDate(increment, interval) {
        setMonth(month.add(increment, interval))
    }

    return (
        <>
            <Row align="center">
                <Col>
                    <Button type="text" shape="circle" onClick={() => changeDate(-1, 'year')} icon={<DoubleLeftOutlined/>}/>
                    <Button type="text" shape="circle" onClick={() => changeDate(-1, 'month')} icon={<LeftOutlined/>}/>
                </Col>
                <Col span={6}>
                    <Typography.Title style={{ textAlign: "center" }} level={4}>{month.format("MMMM, YYYY")}</Typography.Title>
                </Col>
                <Col>
                    <Button type="text"shape="circle"  onClick={() => changeDate(1, 'month')} icon={<RightOutlined/>}/>
                    <Button type="text" shape="circle" onClick={() => changeDate(1, 'year')} icon={<DoubleRightOutlined/>}/>
                </Col>
            </Row>
            <Dates year={month.year()} month={month.month()} />
        </>
    )
}

function Dates(props) {
    const current_month = dayjs({year: props.year, month: props.month}).startOf('month')
    let list_of_days = []

    for (let i = -current_month.day(); i <= current_month.daysInMonth() + (5 - current_month.endOf('month').day()); i++) {
        list_of_days.push(current_month.add(i, 'day'))
    }

    let list_of_weeks = []
    for (let i = 0; i < list_of_days.length / 7; i++) {
        list_of_weeks.push(list_of_days.slice(i*7, (i+1)*7))
    }

    return (
        <>
            <Row justify="space-around">
                { list_of_days.slice(0, 7).map((day) => (<Col key={day}>{day.format("ddd")}</Col>)) }
            </Row>
            { list_of_weeks.map((week) => (<Row>{week.map((day) => (<Day currentMonth={current_month.month()} day={day} />))}</Row>)) }
        </>
    )
}

function Day(props) {
    const [dateData, setDateData] = useState(null)
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        async function getDateData() {
            try {
                const response = await axios.get(`/api/dates/${props.day.format()}`)
                message.success({'content': response.data.message, key: 'date_data'})
                setDateData(response.data.result)
            } catch (error) {
                console.log(error.response.data.err)
                message.error({'content': error.response.data.message, key: 'date_data' })
            }
        }
        getDateData()
        setLoading(false)
    }, [props])

    return (
        <Col flex="auto" style={{
            borderTop: "solid 2px lightgrey",
            margin: "8px 4px"
        }}>
            <Skeleton active loading={isLoading}>
                <Row justify="space-between">
                    <Col>
                        {props.day.format("D")}
                    </Col>
                    <Col>{props.day.isAfter(dayjs()) && 
                        <Popover placement='topLeft' content={<AddHoursForm dateData={dateData} setDateData={setDateData} day={props.day}/>} title={`${dateData ? "Edit" : "Add Business Hours to"} ${props.day.format("MMM D, YYYY")}`} trigger="click">
                            <Tooltip title={dateData ? "Edit hours" : "Add hours"}>
                                <Button size="small" type="dashed" shape="circle" icon={dateData ? <EditOutlined/> : <PlusOutlined/>}></Button>
                            </Tooltip>
                        </Popover>
                    }
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Badge status="success" text="Employees" />
                    </Col>
                </Row>
            </Skeleton>
        </Col>
    )
}

function AddHoursForm(props) {
    const [dateData, setDateData] = useState(props.dateData)
    const [submitState, setSubmitState] = useState(false)

    function onValuesChange(changedValue, { min_emps_working, opening_closing_times }) {
        if (min_emps_working !== dateData?.min_emps_working ||
            opening_closing_times[0].hour() !== dateData?.opens ||
            opening_closing_times[1].hour() !== dateData?.closes) {
            setSubmitState(true)
        } else {
            setSubmitState(false)
        }
    }

    async function onSubmit({ min_emps_working, opening_closing_times }) {
        setSubmitState('loading')
        message.loading({content: "Sending Data", key: "date_message"})
        const data = {
            min_emps_working,
            opens: opening_closing_times[0].hour(),
            closes: opening_closing_times[1].hour()
        }

        if (dateData) data._id = dateData._id // Field is being edited
        else data.date = props.day.format() // Field is being created (inject new date)

        try {
            const response = dateData? await axios.put('/api/dates', data): await axios.post('/api/dates', data)
            if (!dateData) data['_id'] = response.data.result.insertedId
            props.setDateData(data) // Send new date data to day object to change it's state
            setDateData(data) // Change internal state so date can be edited without refreshing
            setSubmitState(false)
            message.success({content: response.data.message, key: "date_message"})
        } catch (error) {
            console.log(error.response.data.err)
            message.error({ content: error.response.data.message, key: 'date_message' })
        }
    }

    async function deleteDay() {
        message.loading({ content: "Queuing day for deletion", key: "date_message"})

        try {
            const response = await axios.delete(`/api/dates/${dateData['_id']}`)
            props.setDateData(null)
            setDateData(null)
            setSubmitState(false)
            message.success({content: response.data.message, key: "date_message"})
        } catch(error) {
            console.log(error.response.data.err)
            message.error({ content: error.response.data.message, key: 'date_message' })
        }
    }
    
    return (
        <Form
        layout="vertical"
        requiredMark
        onFinish={onSubmit}
        onValuesChange={onValuesChange}
        initialValues={dateData ? {
            opening_closing_times: [moment().hour(dateData.opens), moment().hours(dateData.closes)],
            min_emps_working: dateData.min_emps_working
        } : { min_emps_working: 0 }}
        >
            <Form.Item rules={[{ required: true, message: "Please input opening and closing times"}]} label="Opening/Closing Times" name="opening_closing_times" tooltip="Required">
                <TimePicker.RangePicker autoFocus={true} format="HH" placeholder={['Opening', 'Closing']} />
            </Form.Item>
            <Form.Item rules={[{ required: true, message: "Please input minimum working employees"}]} label="Minimum Employees Working" name="min_emps_working" tooltip="Required">
                <InputNumber min={0} max={allEmployeesLength || 0}/>
            </Form.Item>
            <Form.Item>
                <Space>
                    <Button disabled={submitState ? false: true} loading={submitState === 'loading'} htmlType="submit" type="primary">Submit</Button>
                    {dateData && <Button onClick={deleteDay} type="default" danger>Delete</Button>}
                </Space>
            </Form.Item>
            <Typography.Text type="secondary">Don't worry, you can edit this after you're done.</Typography.Text>
        </Form>
    )
}
