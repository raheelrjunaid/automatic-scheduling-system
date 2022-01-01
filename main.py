from random import randint, shuffle
from rich.table import Table
from rich import print

table = Table(show_header=True, show_lines=True)
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

opening_slots = [
    [opening - 70, opening + 500],
    [opening - 70, opening + 800],
]

regular_slots = [
    [opening, opening + 500],
    [opening, opening + 800],
    [closing - 500, closing],
    [closing - 800, closing],
]

closing_slots = [
    [closing - 500, closing + 30],
    [closing - 800, closing + 30],
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

def potential_slot(slots, employee_availability):
    potential_slots = slots[:]
    for slot in slots:
        if slot[0] < employee_availability[0] or slot[1] > employee_availability[1]:
            potential_slots.remove(slot)
    return potential_slots

def book_employee(employee, slots, day):
    if slots == []:
        employee.scheduled.append(None)
    else:
        if type(slots[0]) is list:
            slot = slots[randint(0, len(slots) - 1)]
        else:
            slot = slots

        if slot[0] == opening - 70 and len(day.emp_opening) < emp_outside_of_hours:
            day.emp_opening.append(employee)
        elif slot[1] == closing + 30 and len(day.emp_closing) < emp_outside_of_hours:
            day.emp_closing.append(employee)

        employee.scheduled.append(slot)
        day.emp_working.append(employee)

employees = [jamie, jasmine, therese, bandish, aaron, ben_o]
randomized_employees = employees[:]

for day_number, day in enumerate(days):
    table.add_column(day.name.capitalize())
    shuffle(randomized_employees)

    for employee in randomized_employees:
        if employee.fixed_hours:
            employee_hours = employee.availability[day_number]
            if employee.availability[day_number] in opening_slots:
                employee.scheduled.append(employee.availability[day_number])
                day.emp_opening.append(employee)
                day.emp_working.append(employee)

            elif employee.availability[day_number] in closing_slots:
                employee.scheduled.append(employee.availability[day_number])
                day.emp_closing.append(employee)
                day.emp_working.append(employee)

            elif employee.availability[day_number] in regular_slots:
                employee.scheduled.append(employee.availability[day_number])
                day.emp_working.append(employee)

            else:
                employee.scheduled.append(None)

        else:
            employee_availability = employee.availability[day_number]
            if employee_availability != None:
                potential_opening = potential_slot(opening_slots, employee_availability)
                potential_closing = potential_slot(closing_slots, employee_availability)
                potential_regular = potential_slot(regular_slots, employee_availability)

                if not all([potential_opening, potential_closing, potential_regular]):
                    book_employee(employee, employee_availability, day)
                else:
                    book_employee(employee, potential_opening, day)
                    book_employee(employee, potential_closing, day)
                    book_employee(employee, potential_regular, day)

            else:
                employee.scheduled.append(None)

employees.sort(key=lambda employee : employee.name)
for employee in employees:
    schedule = []
    for day in employee.scheduled:
        if day == None:
            schedule.append("N/A")
        else:
            start = day[0]
            end = day[1]

            if start >= 1300 and start < 2200:
                start -= 1200
                start = f"{str(start)[0:1]}:{str(start)[1:]}pm"

            elif start >= 1200:
                start = f"{str(start)[0:2]}:{str(start)[2:]}pm"
            elif start >= 1000:
                start = f"{str(start)[0:2]}:{str(start)[2:]}am"
            else: 
                start = f"{str(start)[0:1]}:{str(start)[1:]}am"

            if end >= 1300 and end < 2200:
                end -= 1200
                end = f"{str(end)[0:1]}:{str(end)[1:]}pm"

            elif end >= 1200:
                end = f"{str(end)[0:2]}:{str(end)[2:]}pm"
            elif end >= 1000:
                end = f"{str(end)[0:2]}:{str(end)[2:]}am"
            else: 
                end = f"{str(end)[0:1]}:{str(end)[1:]}am"

            if day[0] <= opening - 30:
                schedule.append(f"[green bold]{start}[/green bold] - {end}")
            elif day[1] >= closing + 30:
                schedule.append(f"{start} - [red bold]{end}[/red bold]")
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

print("\n[bold green]Green[/bold green] indicates opening shift.")
print("[bold red]Red[/bold red] indicates closing shift.\n")
print(table)
