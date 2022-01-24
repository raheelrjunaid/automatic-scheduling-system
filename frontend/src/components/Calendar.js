import { useState } from 'react'

export default function Calendar() {
    const [month, setMonth] = useState(new Date())

    function nextMonth() {
        setMonth(new Date(month.getFullYear(), month.getMonth() + 1))
    }

    function prevMonth() {
        setMonth(new Date(month.getFullYear(), month.getMonth() - 1))
    }

    return (
        <>
            <caption>{month.toLocaleDateString()}</caption>
            <button onClick={prevMonth}>Previous Month</button>
            <button onClick={nextMonth}>Next Month</button>
            <Dates year={month.getFullYear()} month={month.getMonth()} />
        </>
    )
}

function Dates(props) {
    const month = new Date(props.year, props.month)
    let list_of_days = []

    function getDays(year, month) {
        let date = new Date(year, month)
        let date_month = date.getMonth()
        let days = []
        while (date.getMonth() === date_month) {
            days.push(new Date(date));
            date.setDate(date.getDate() + 1);
        }
        return days
    }

    if (month.getDay() !== 0) {
        let days = getDays(props.year, props.month - 1)
        days = days.slice(days.length - month.getDay())
        for (let i = 0; i < month.getDay(); i++) {
            list_of_days.push(days[i])
        }
    }

    getDays(props.year, props.month).forEach((day) => {
        list_of_days.push(day)
    })

    let last_day = list_of_days[list_of_days.length - 1]
    if (last_day.getDay() !== 6) {
        let days = getDays(props.year, props.month + 1)
        for (let i = 0; last_day.getDay() !== 6; i++) {
            list_of_days.push(days[i])
            last_day = list_of_days[list_of_days.length - 1]
        }
    }

    let list_of_weeks = []
    for (let i = 0; i < list_of_days.length / 7; i++) {
        list_of_weeks.push(list_of_days.slice(i*7, (i+1)*7))
    }

    return (
        <table>
            <thead>
                <tr>
                    {list_of_days.slice(0, 7).map((day) => (<th key={day}>{day.toLocaleString("default", { weekday : "long" })}</th>))}
                </tr>
            </thead>
            <tbody>
                {list_of_weeks.map((week, week_index) => (<tr key={week_index}>{week.map((day) => (<Day month={month.getMonth()} date={day}/>))}</tr>))}
            </tbody>
        </table>
    )
}

function Day(props) {
    return (
        <td key={props.day_index} className={props.month !== props.date.getMonth() ? "extra": "regular"}>{props.date.getDate()}</td>
    )
}
