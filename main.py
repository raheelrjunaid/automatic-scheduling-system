from random import shuffle, sample
from rich.table import Table
from rich import print, box

table = Table(title="Employee Schedule", box=box.MINIMAL_HEAVY_HEAD, show_header=True, show_lines=True)
table.add_column("Name")

opening = 1000
closing = 2100

emp_outside_of_hours = 2

# TODO holiday hours
# special_hours = {}

class Employee():
   def __init__(self, name, availability, fixed_hours=False):
        self.name = name
        self.fixed_hours = fixed_hours
        self.availability = availability
        self.scheduled = []

class Day():
    def __init__(self, name):
        self.name = name
        self.emp_working = []
        self.emp_closing = []
        self.emp_opening = []

sunday = Day("sunday")
monday = Day("monday")
tuesday = Day("tuesday")
wednesday = Day("wednesday")
thursday = Day("thursday")
friday = Day("friday")
saturday = Day("saturday")

days = [
    sunday,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday
]

available_slots = [
    [opening - 70, opening + 500],
    [opening - 70, opening + 800],
    [opening, opening + 500],
    [opening, opening + 800],
    [closing - 500, closing],
    [closing - 800, closing],
    [closing - 500, closing + 30],
    [closing - 800, closing + 30]
]

bandish = Employee("bandish", [
    None,
    [930, 1800],
    [930, 1800],
    [930, 1800],
    [930, 1800],
    [930, 1800],
    None
], True)

therese = Employee("therese", [
    [1030, 1830],
    [1200, 2030],
    [1200, 2030],
    [1200, 2030],
    [1300, 2130],
    [1300, 2130],
    [930, 2200]
])

jasmine = Employee("jasmine", [
    None,
    [1330, 2130],
    [1330, 2130],
    [1330, 2130],
    [1330, 2130],
    [1330, 2130],
    None,
])

jamie = Employee("jamie", [
    [0000, 2300],
    [0000, 2300],
    [0000, 2300],
    [0000, 2300],
    [0000, 2300],
    [0000, 2300],
    [0000, 2300],
])

aaron = Employee("aaron", [
    [0000, 2300],
    [0000, 2300],
    [0000, 2300],
    [0000, 2300],
    [0000, 2300],
    [0000, 2300],
    [0000, 2300],
])

ben_o = Employee("ben o", [
    None,
    None,
    None,
    None,
    None,
    [0000, 2300],
    [0000, 2300],
])

ben_a = Employee("ben a", [
    [1100, 1800],
    None,
    [1000, 1800],
    [1200, 2000],
    [1200, 2000],
    None,
    [1000, 1800],
])

monica = Employee("monica", [
    [0000, 2300],
    None,
    None,
    [1630, 2100],
    None,
    [1630, 2100],
    None
])

def potential_slot(slots, employee_availability, day):
    potential_slots = slots[:]
    for slot in slots:
        if slot[0] < employee_availability[0] or slot[1] > employee_availability[1]:
            potential_slots.remove(slot)
        elif slot[0] <= opening - 70 and len(day.emp_opening) >= emp_outside_of_hours:
            potential_slots.remove(slot)
        elif slot[1] >= closing + 30 and len(day.emp_closing) >= emp_outside_of_hours:
            potential_slots.remove(slot)
    return potential_slots

def book_employee(employee, slots, day):
    if slots == [] or slots is None:
        employee.scheduled.append(None)
    else:
        if type(slots[0]) is list:
            if opening - 70 in map(lambda x: x[0], slots):
                slots = [slot for slot in slots if slot[0] <= opening - 70]
            elif closing + 30 in map(lambda x: x[1], slots):
                slots = [slot for slot in slots if slot[1] >= closing + 30]
            slot = sample(slots, 1)[0]

        else:
            slot = slots

        if slot[0] <= opening - 70:
            day.emp_opening.append(employee)
        elif slot[1] >= closing + 30:
            day.emp_closing.append(employee)

        employee.scheduled.append(slot)
        day.emp_working.append(employee)

employees = [monica, ben_a, jamie, jasmine, therese, bandish, aaron, ben_o]

for day_number, day in enumerate(days):
    table.add_column(day.name.capitalize())

    for employee in [employee for employee in employees if employee.fixed_hours]:
        employee_hours = employee.availability[day_number]
        book_employee(employee, employee_hours, day)

    shuffle(employees)
    for employee in [employee for employee in employees if not employee.fixed_hours]:
        employee_availability = employee.availability[day_number]
        if employee_availability != None:
            potential_slots = potential_slot(available_slots, employee_availability, day)

            if potential_slots == []:
                book_employee(employee, employee_availability, day)
            else:
                book_employee(employee, potential_slots, day)

        else:
            employee.scheduled.append(None)

employees.sort(key=lambda employee : employee.name)
for employee in employees:
    schedule = []

    for day in employee.scheduled:
        if day == None:
            schedule.append("[grey50]N/A[/]")
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

            if day[0] <= opening - 30:
                schedule.append(f"[green bold]{start}[/] - {end}")
            elif day[1] >= closing + 30:
                schedule.append(f"{start} - [red bold]{end}[/]")
            else:
                schedule.append(f"{start} - {end}")

    table.add_row(employee.name.capitalize(),
        schedule[0],
        schedule[1],
        schedule[2],
        schedule[3],
        schedule[4],
        schedule[5],
        schedule[6],
    )

print("\n[bold green]Green[/] indicates opening shift.")
print("[bold red]Red[/] indicates closing shift.\n")
print(table)
