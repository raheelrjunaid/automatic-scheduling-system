from random import shuffle, sample, randint
from rich.table import Table
from rich.prompt import Confirm
from rich import print, box
import time
from employees import employees
from days import days

twelve_hour = Confirm.ask("12 Hour Time?")

# Create table
schedule_table = Table(title="Employee Schedule", box=box.MINIMAL_HEAVY_HEAD, show_header=True, show_lines=True)
schedule_table.add_column("Name")

# Initial Parameters
emp_outside_of_hours = 2

# TODO holiday hours
# special_hours = {}

def potential_slot(employee_availability, day):
    slots = day.slots[:]
    for slot in day.slots:
        if slot[0] < employee_availability[0] or slot[1] > employee_availability[1]:
            slots.remove(slot)
        elif slot[0] <= day.opening - .5 and len(day.emp_opening) >= emp_outside_of_hours:
            slots.remove(slot)
        elif slot[1] >= day.closing + .5 and len(day.emp_closing) >= emp_outside_of_hours:
            slots.remove(slot)
    return slots

def book_employee(employee, slots, day):
    if slots == [] or slots is None:
        employee.scheduled.append(None)
    else:
        opening_time = day.opening - .5
        closing_time = day.closing + .5
        if type(slots[0]) is list:
            if opening_time in map(lambda x: x[0], slots):
                slots = [slot for slot in slots if slot[0] <= opening_time]
            elif closing_time in map(lambda x: x[1], slots):
                slots = [slot for slot in slots if slot[1] >= closing_time]
            slot = sample(slots, 1)[0]

        else:
            slot = slots

        if slot[0] <= opening_time:
            day.emp_opening.append(employee)
        elif slot[1] >= closing_time:
            day.emp_closing.append(employee)

        employee.scheduled.append(slot)
        day.emp_working.append(employee)

fixed_employees = [employee for employee in employees if employee.fixed_hours]
reg_employees = [employee for employee in employees if not employee.fixed_hours]
hours = []

def display_time(hours, day):
    start = hours[0]
    end = hours[1]
    if twelve_hour:
        opening = time.strftime("%-I:%M%p", time.gmtime(start*60*60))
        closing = time.strftime("%-I:%M%p", time.gmtime(end*60*60))
    else:
        opening = time.strftime("%-H:%M", time.gmtime(start*60*60))
        closing = time.strftime("%-H:%M", time.gmtime(end*60*60))

    if start < day.opening:
        timing = f"[green bold]{opening}[/] - {closing}"
    elif end > day.closing:
        timing = f"{opening} - [red bold]{closing}"
    else:
        timing = f"{opening} - {closing}"

    return timing

for day_number, day in enumerate(days):
    schedule_table.add_column(day.name.capitalize(), justify="center")

    for employee in fixed_employees:
        employee_hours = employee.availability[day_number]
        book_employee(employee, employee_hours, day)

    shuffle(reg_employees)
    for employee in reg_employees:
        employee_availability = employee.availability[day_number]
        if employee_availability != None:
            potential_slots = potential_slot(employee_availability, day)

            if potential_slots == []:
                if employee_availability[0] < day.opening - .5:
                    if len(day.emp_opening) >= emp_outside_of_hours:
                        employee_availability[0] = day.opening
                    else:
                        employee_availability[0] = day.opening - .5
                elif employee_availability[1] > day.closing + .5:
                    if len(day.emp_closing) >= emp_outside_of_hours:
                        employee_availability[1] = day.closing
                    else:
                        employee_availability[1] = day.closing + .5

                book_employee(employee, employee_availability, day)
            else:
                book_employee(employee, potential_slots, day)

        else:
            employee.scheduled.append(None)

    hours.append(display_time([day.opening, day.closing], day))

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
            employee.scheduled[day_number][1]], day))

    schedule_table.add_row(employee.name.capitalize(),
        *schedule
    )

print("\n[bold green]Green[/] indicates opening shift.")
print("[bold red]Red[/] indicates closing shift.\n")
print(schedule_table)
