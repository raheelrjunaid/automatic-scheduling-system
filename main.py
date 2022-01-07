from functions import display_time, generate_day
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
twelve_hour = Confirm.ask("12 Hour Time?")  # Convert schedule to 12 hour time
hours = []

# Schedule employees for every day
for day_number, day in enumerate(days):
    # Add a day column to the calendar because I can
    schedule_table.add_column(f"{day.name.capitalize()}\n {day.emp_working}", justify="center")
    # Add day to store hours row
    hours.append(display_time([day.opening, day.closing], day, twelve_hour))

    generate_day(employees, day, day_number, emp_outside_hours)

    schedule_table.add_column(f"{day.name.capitalize()}\nCoverage: {len(day.emp_working)}",
            justify="center")

# Add hours to schedule table
schedule_table.add_row("Hours", *hours, style="black on yellow")

# Display employees in alphabetical order (by name)
employees.sort(key=lambda employee: employee.name)
for employee in employees:
    schedule = []  # List of employee bookings

    # If employee isn't scheduled for a day, show N/A
    # If they are, display their opening and closing shifts
    for day_number, day in enumerate(days):
        if employee.scheduled[day_number] is None:
            schedule.append("[grey50]N/A")
        else:
            schedule.append(display_time([
                employee.scheduled[day_number].start,
                employee.scheduled[day_number].end
            ], day, twelve_hour))

    # Add employee to schedule
    schedule_table.add_row(employee.name.capitalize(), *schedule)

# Print table
print("\n[bold green]Green[/] indicates opening shift.")
print("[bold red]Red[/] indicates closing shift.\n")
print(schedule_table)
