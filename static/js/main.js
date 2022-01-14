const add_employee_form = document.querySelector("#add_employee_form")
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

get_employees()
today = new Date()
initialize_calendar(today.getFullYear(), today.getMonth())

async function get_employees() {
    try {
        list = document.querySelector("#employees-list")
        list.innerHTML = ''
        const response = await fetch("/employee/all")
        const data = await response.json()
        for(key in data) {
            employee = data[key]
            li = document.createElement("li")
            li.textContent = employee.first_name + " " + employee.last_name
            list.appendChild(li)
        }
    } catch(error) {
        console.log(error.response)
    }
}

function initialize_calendar(year, month) {
    try {
        const month_header = document.querySelector("#month-and-year")
        const current_month = new Date(year, month)
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
        const calendar_week_names = document.querySelectorAll(".calendar > thead > tr > th")
        let week_row = document.createElement("tr")
        calendar_weeks.appendChild(week_row)

        const days_of_month = get_days_in_month(year, month)
        let i = 0
        let current_day = calendar_week_names[0]
        
        while (current_day.dataset.number != days_of_month[0].getDay()) {
            i += 1
            current_day = calendar_week_names[i]
            blank_to_add = document.createElement("td")
            week_row.appendChild(blank_to_add)
        }
        for (key in days_of_month) {
            let day = days_of_month[key]
            let day_to_add = document.createElement("td")

            if (today.getDate() == day.getDate() &&
                today.getMonth() == month) {
                day_to_add.classList.add("table-primary")
            }
            day_to_add.textContent = day.getDate()
            week_row.appendChild(day_to_add)

            if (day.getDay() == 6) {
                week_row = document.createElement("tr")
                calendar_weeks.appendChild(week_row)
            }
        }
    } catch(error) {
        console.log(error)
    }
}

function get_days_in_month(year, month) {
    var date = new Date(year, month, 1);
    var days = [];
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
    for (field in fields) {
        values[field] = fields[field].value
    }

    const options = {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {'Content-Type': 'application/json'}
    }

    try {
        const response = await fetch("/employee/add", options)
        const data = await response.json()
        console.log(data)
        for(field in fields) {
            fields[field].value = ""
        }
        if (add_employee_form.classList.contains("was-validated")) {
            add_employee_form.classList.remove("was-validated")
        }
        get_employees()

    } catch(error) {
        console.log(error.response)
    }
    return false
}

// testing purposes only
async function reset_employees() {
    
    try {
        const response = await fetch("/employee/reset")
        const data = await response.json()
        console.log(data)
        get_employees()

    } catch(error) {
        console.log(error.response)
    }
}
