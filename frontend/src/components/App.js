// import styles from './App.module.scss'
import Calendar from './Calendar.js'
import { Tabs, Typography } from 'antd'
import 'antd/dist/antd.css'

function App() {
    return (
        <>
            <Typography.Title style={{textAlign: 'center'}}>Raheel's Project</Typography.Title>
            <Tabs defaultActiveKey='1' centered>
                <Tabs.TabPane tab="Calendar" key="1">
                    <Calendar />
                </Tabs.TabPane>
                <Tabs.TabPane tab="Employees" key="2"></Tabs.TabPane>
            </Tabs>
        </>
    );
}

export default App;