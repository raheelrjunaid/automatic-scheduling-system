// import styles from './App.module.scss'
import Calendar from './Calendar.js'
import { Typography } from 'antd'
import 'antd/dist/antd.css'

const { Title } = Typography

function App() {
    return (
        <>
            <Title>PASS</Title>
            {/* TODO fix calendar next month on date click */}
            <Calendar />
        </>
    );
}

export default App;