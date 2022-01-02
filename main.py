from random import shuffle, sample, randint
from rich.table import Table
from rich import print, box
from employees import employees
from days import days

# Create tables
schedule_table = Table(title="Employee Schedule", box=box.MINIMAL_HEAVY_HEAD, show_header=True, show_lines=True)
schedule_table.add_column("Name")

sick_table = Table(title="Sick Replacement Calls", box=box.MINIMAL_HEAVY_HEAD, show_header=True, show_lines=True)
sick_table.add_column("Name")

# Initial Parameters
emp_outside_of_hours = 2
max_emps_working = 5

# TODO holiday hours
# special_hours = {}

def potential_slot(employee_availability, day):
    slots = day.slots[:]
    for slot in day.slots:
        if slot[0] < employee_availability[0] or slot[1] > employee_availability[1]:
            slots.remove(slot)
        elif slot[0] <= day.opening - 70 and len(day.emp_opening) >= emp_outside_of_hours:
            slots.remove(slot)
        elif slot[1] >= day.closing + 30 and len(day.emp_closing) >= emp_outside_of_hours:
            slots.remove(slot)
    return slots

def book_employee(employee, slots, day):
    if slots == [] or slots is None:
        employee.scheduled.append(None)
    else:
        if type(slots[0]) is list:
            if day.opening - 70 in map(lambda x: x[0], slots):
                slots = [slot for slot in slots if slot[0] <= day.opening - 70]
            elif day.closing + 30 in map(lambda x: x[1], slots):
                slots = [slot for slot in slots if slot[1] >= day.closing + 30]
            slot = sample(slots, 1)[0]

        else:
            slot = slots

        if slot[0] <= day.opening - 70:
            day.emp_opening.append(employee)
        elif slot[1] >= day.closing + 30:
            day.emp_closing.append(employee)

        employee.scheduled.append(slot)
        day.emp_working.append(employee)

fixed_employees = [employee for employee in employees if employee.fixed_hours]
reg_employees = [employee for employee in employees if not employee.fixed_hours]

for day_number, day in enumerate(days):
    schedule_table.add_column(day.name.capitalize(), justify="center")
    sick_table.add_column(day.name.capitalize(), justify="center")

    for employee in fixed_employees:
        employee_hours = employee.availability[day_number]
        book_employee(employee, employee_hours, day)

    shuffle(reg_employees)
    for employee in reg_employees:
        employee_availability = employee.availability[day_number]
        if employee_availability != None:
            potential_slots = potential_slot(employee_availability, day)

            if potential_slots == []:
                if employee_availability[0] < day.opening - 70:
                    employee_availability[0] = day.opening - 70
                elif employee_availability[1] > day.closing + 30:
                    employee_availability[1] = day.closing + 30

                book_employee(employee, employee_availability, day)
            else:
                book_employee(employee, potential_slots, day)

        else:
            employee.scheduled.append(None)

    while len([employee for employee in day.emp_working if not employee.fixed_hours]) > max_emps_working:
        employee = day.emp_working[randint(0, len(reg_employees) - 1)] 

        if not (employee in day.emp_opening or employee in day.emp_closing):
            day.emp_working.remove(employee)
            employee.scheduled[day_number] = None
            employee.call_back_days.append(day)

schedule_table.add_row("Hours:", 
    f"{days[0].opening} - {days[0].closing}",
    f"{days[1].opening} - {days[1].closing}",
    f"{days[2].opening} - {days[2].closing}",
    f"{days[3].opening} - {days[3].closing}",
    f"{days[4].opening} - {days[4].closing}",
    f"{days[5].opening} - {days[5].closing}",
    f"{days[6].opening} - {days[6].closing}",
    style="blue"
)

employees.sort(key=lambda employee : employee.name)
for employee in employees:
    schedule = []

    for day_number, day in enumerate(employee.scheduled):
        if day == None:
            schedule.append("[grey50]N/A")
        else:
            start = day[0]
            end = day[1]

            if start < 1000:
                start = f"{str(start)[0:1]}:{str(start)[1:]}"
            else:
                start = f"{str(start)[0:2]}:{str(start)[2:]}"
            if end < 1000:
                end = f"{str(end)[0:1]}:{str(end)[1:]}"
            else:
                end = f"{str(end)[0:2]}:{str(end)[2:]}"

            if day[0] <= days[day_number].opening - 30:
                schedule.append(f"[green bold]{start}[/] - {end}")
            elif day[1] >= days[day_number].closing + 30:
                schedule.append(f"{start} - [red bold]{end}")
            else:
                schedule.append(f"{start} - {end}")

    schedule_table.add_row(employee.name.capitalize(),
        schedule[0],
        schedule[1],
        schedule[2],
        schedule[3],
        schedule[4],
        schedule[5],
        schedule[6],
    )

    if employee.call_back_days != []:
        call_backs = [":white_check_mark:" if day in \
            employee.call_back_days else "[grey50]N/A" for day in days]
        sick_table.add_row(employee.name.capitalize(), 
            call_backs[0],
            call_backs[1],
            call_backs[2],
            call_backs[3],
            call_backs[4],
            call_backs[5],
            call_backs[6],
        )

print("\n[bold green]Green[/] indicates opening shift.")
print("[bold red]Red[/] indicates closing shift.\n")
print(schedule_table)

print(":white_check_mark: indicates availability.\n")
print(sick_table)
