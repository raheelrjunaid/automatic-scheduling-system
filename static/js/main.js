const add_employee_form = document.querySelector("#add_employee_form")
const add_date_form = document.querySelector("#add_date_form")
add_date_form.addEventListener("submit", (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (add_date_form.checkValidity()) {
        add_date()
    }
    if (!add_date_form.classList.contains("was-validated")) {
        add_date_form.classList.add("was-validated")
    }
});
add_employee_form.addEventListener("submit", (event) => {
    event.preventDefault()
    event.stopPropagation()
    if (add_employee_form.checkValidity()) {
        add_employee()
    }
    if (!add_employee_form.classList.contains("was-validated")) {
        add_employee_form.classList.add("was-validated")
    }
});

display_employees()
const calendar = document.querySelector("#calendar")
const today = new Date()
const today_button = document.querySelector("#calendar-today")
today_button.onclick = () => {
    initialize_calendar(today.getFullYear(), today.getMonth())
}
initialize_calendar(today.getFullYear(), today.getMonth())

async function display_employees(existing_employees=undefined) {
    const list = document.querySelector("#employees-list")
    list.innerHTML = ''
    let employees = existing_employees
    if (!employees) {
        const response = await fetch("/employee/all")
        employees = await response.json()
    }
    employees.forEach((employee) => {
        let li = document.createElement("li")
        li.textContent = employee.first_name + " " + employee.last_name
        list.appendChild(li)
    })
}

function init_day(day, dates_hours) {
    const today = new Date()
    const day_to_add = document.createElement("td")
    if (today.getDate() == day.getDate() &&
        today.getMonth() == day.getMonth()) {
        day_to_add.classList.add("table-primary")
    }

    let date_hours = dates_hours.filter(date => new Date(Date.parse(date.date)).getDate() == day.getDate())
    day_to_add.dataset.date = day.toLocaleDateString()
    day_to_add.textContent = day.getDate()
    if (date_hours.length) {
        day_to_add.textContent += " " + date_hours[0].opening_hour
        day_to_add.textContent += " " + date_hours[0].closing_hour
    } else {
        day_to_add.textContent += " N/H"
    }
    return day_to_add
}

async function initialize_calendar(year, month) {
    const response = await fetch("/dates/all")
    const dates_hours = await response.json()

    const month_header = document.querySelector("#month-and-year")
    const current_month = new Date(year, month)
    calendar.dataset.month = month
    calendar.dataset.year = year
    let prev_month
    let next_month
    const prev_month_button = document.querySelector("#previous-month")
    const next_month_button = document.querySelector("#next-month")

    prev_month = new Date(year, month - 1)
    prev_month_button.onclick = () => {
        initialize_calendar(prev_month.getFullYear(), prev_month.getMonth())
    }

    next_month = new Date(year, month + 1)
    next_month_button.onclick = () => {
        initialize_calendar(next_month.getFullYear(), next_month.getMonth())
    }

    prev_month_button.textContent = prev_month.toLocaleString("default", { month: "long" })
    next_month_button.textContent = next_month.toLocaleString("default", { month: "long" })
    month_header.textContent = current_month.toLocaleString("default", { month: "long" }) + ", "
    month_header.textContent += year

    const calendar_weeks = document.querySelector(".calendar > tbody")
    calendar_weeks.innerHTML = ''
    let week_row = document.createElement("tr")
    calendar_weeks.appendChild(week_row)

    const days_of_month = get_days_in_month(year, month)
    const starting_day = days_of_month[0].getDay()

    let last_month_days = get_days_in_month(prev_month.getFullYear(), prev_month.getMonth())
    for (let i = 0; i < starting_day; i++) {
        let day = last_month_days[last_month_days.length - starting_day + i]
        let blank_to_add = init_day(day, dates_hours)
        blank_to_add.classList.add("table-light")
        week_row.appendChild(blank_to_add)
    }
    days_of_month.forEach((day) => {

        let day_to_add = init_day(day, dates_hours)
        week_row.appendChild(day_to_add)

        if (day.getDay() == 6) {
            week_row = document.createElement("tr")
            calendar_weeks.appendChild(week_row)
        }
    })
    let next_month_days = get_days_in_month(next_month.getFullYear(), next_month.getMonth())
    for (let i = 0; week_row.childNodes.length < 7; i++) {
        let day = next_month_days[i]
        let day_to_add = init_day(day, dates_hours)
        day_to_add.classList.add("table-light")
        week_row.appendChild(day_to_add)
    }
}

function get_days_in_month(year, month) {
    let date = new Date(year, month, 1);
    let days = [];
    while (date.getMonth() === month) {
        days.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }
    return days;
}

async function add_employee() {

    const fields = {
        "first_name": document.querySelector("input[name='first_name']"),
        "last_name": document.querySelector("input[name='last_name']"),
        "max_working_days": document.querySelector("input[name='max_working_days']"),
        "fixed_hours": document.querySelector("input[name='fixed_hours']"),
    }

    let values = {}
    for (const field in fields) {
        values[field] = fields[field].value
    }

    if (add_employee_form.classList.contains("was-validated")) {
        add_employee_form.classList.remove("was-validated")
    }

    const options = {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {'Content-Type': 'application/json'}
    }

    try {
        const response = await fetch("/employee/add", options)
        const data = await respons
    } catch(error) {
        console.log(error)
    }
    display_employees()
    return false
}

function add_date() {

    const fields = {
        "date": document.querySelector("input[name='date']"),
        "min_emps_working": document.querySelector("input[name='min_emps_working']"),
        "opening_time": document.querySelector("input[name='opening_time']"),
        "closing_time": document.querySelector("input[name='closing_time']"),
    }

    let values = {}
    for (const field in fields) {
        values[field] = fields[field].value
    }

    if (add_employee_form.classList.contains("was-validated")) {
        add_employee_form.classList.remove("was-validated")
    }
    initialize_calendar(calendar.dataset.year, calendar.dataset.month)

    const options = {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {'Content-Type': 'application/json'}
    }

    try {
        fetch("/employee/add", options)

    } catch(error) {
        console.log(error)
    }
    return false
}


// testing purposes only
async function reset_employees() {
    
    try {
        const response = await fetch("/employee/reset")
        const data = await response.json()
        display_employees(data)

    } catch(error) {
        console.log(error)
    }
}
