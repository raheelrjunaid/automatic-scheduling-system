from random import randint, shuffle
from rich.table import Table
from rich import print

table = Table(show_header=True, show_lines=True)
table.add_column("Name")

opening = 1000
closing = 2100

# TODO holiday hours
# special_hours = {}

class Employee():
    def __init__(self, name, availability):
        self.name = name
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

bob = Employee("bob", [
    [800, 2000],
    [1200, 2400],
    [800, 2000],
    [1000, 2400],
    None,
    [1200, 2400],
    None,
])

karen = Employee("karen", [
    None,
    [1200, 2400],
    None,
    [900, 1500],
    [1200, 2400],
    [1500, 2100],
    [900, 2400],
])

tyler = Employee("tyler", [
    [1200, 2400],
    [900, 1500],
    None,
    [800, 2000],
    None,
    [1000, 2400],
    [1500, 2100],
])

employees = [bob, karen, tyler]
randomized_employees = employees[:]

for day_number, day in enumerate(days):
    table.add_column(day.name.capitalize())
    shuffle(randomized_employees)

    for employee in randomized_employees:
        employee_availability = employee.availability[day_number]
        if employee_availability != None:
            potential_opening_slots = opening_slots[:]
            for slot in opening_slots:
                if slot[0] < employee_availability[0] or slot[1] > employee_availability[1]:
                    potential_opening_slots.remove(slot)

            potential_slots = regular_slots[:]
            for slot in regular_slots:
                if slot[0] < employee_availability[0] or slot[1] > employee_availability[1]:
                    potential_slots.remove(slot)

            potential_closing_slots = closing_slots[:]
            for slot in closing_slots:
                if slot[0] < employee_availability[0] or slot[1] > employee_availability[1]:
                    potential_closing_slots.remove(slot)
            
            if len(day.emp_opening) < 2 and len(potential_opening_slots) != 0:
                employee.scheduled.append(potential_opening_slots[randint(0, len(potential_opening_slots) - 1)])
                day.emp_opening.append(employee)
                day.emp_working.append(employee)

            elif len(day.emp_closing) < 2 and len(potential_closing_slots) != 0:
                employee.scheduled.append(potential_closing_slots[randint(0, len(potential_closing_slots) - 1)])
                day.emp_closing.append(employee)
                day.emp_working.append(employee)

            else:
                employee.scheduled.append(potential_slots[randint(0, len(potential_slots) - 1)])
                day.emp_working.append(employee)

        else:
            employee.scheduled.append(None)

for employee in employees:
    schedule = []
    for day in employee.scheduled:
        if day == None:
            schedule.append("N/A")
        else:
            start = day[0]
            end = day[1]

            if start >= 1200:
                start = start - 1200
                start = f"{str(start)[0:1]}:{str(start)[1:]}pm"
            elif start >= 1000:
                start = f"{str(start)[0:2]}:{str(start)[2:]}am"
            else: 
                start = f"{str(start)[0:1]}:{str(start)[1:]}am"

            if end >= 1200:
                end = end - 1200
                end = f"{str(end)[0:1]}:{str(end)[1:]}pm"
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
