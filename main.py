from random import shuffle
from functions import potential_slot, book_employee, display_time
from rich.table import Table
from rich.prompt import Confirm
from rich import print, box
from employees import employees
from days import days

# Create table
schedule_table = Table(title="Employee Schedule", box=box.MINIMAL_HEAVY_HEAD, show_header=True, show_lines=True)
schedule_table.add_column("Name")

# Initial Parameters
emp_outside_hours = 2
twelve_hour = Confirm.ask("12 Hour Time?") # Convert schedule to 12 hour time
fixed_employees = [employee for employee in employees if employee.fixed_hours]
reg_employees = [employee for employee in employees if not employee.fixed_hours]
hours = []

for day_number, day in enumerate(days):
    schedule_table.add_column(day.name.capitalize(), justify="center")

    for employee in fixed_employees:
        employee_hours = employee.availability[day_number]
        book_employee(employee, employee_hours, day)

    shuffle(reg_employees)
    for employee in reg_employees:
        employee_availability = employee.availability[day_number]
        if employee_availability != None:
            potential_slots = potential_slot(employee_availability, day, emp_outside_hours)

            if potential_slots == []:
                if employee_availability[0] < day.opening - .5:
                    if len(day.emp_opening) >= emp_outside_hours:
                        employee_availability[0] = day.opening
                    else:
                        employee_availability[0] = day.opening - .5
                elif employee_availability[1] > day.closing + .5:
                    if len(day.emp_closing) >= emp_outside_hours:
                        employee_availability[1] = day.closing
                    else:
                        employee_availability[1] = day.closing + .5

                book_employee(employee, employee_availability, day)
            else:
                book_employee(employee, potential_slots, day)

        else:
            employee.scheduled.append(None)

    hours.append(display_time([day.opening, day.closing], day, twelve_hour))

schedule_table.add_row("Hours:", 
    *hours,
    style="blue"
)

employees.sort(key=lambda employee : employee.name)
for employee in employees:
    schedule = []

    for day_number, day in enumerate(days):
        if employee.scheduled[day_number] == None:
            schedule.append("[grey50]N/A")
        else:
            schedule.append(display_time([employee.scheduled[day_number][0], \
            employee.scheduled[day_number][1]], day, twelve_hour))

    schedule_table.add_row(employee.name.capitalize(),
        *schedule
    )

print("\n[bold green]Green[/] indicates opening shift.")
print("[bold red]Red[/] indicates closing shift.\n")
print(schedule_table)
