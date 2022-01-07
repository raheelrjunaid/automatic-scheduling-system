from functions import display_time, generate_day, reduce_time
from pudb import set_trace
from rich.table import Table
from rich.prompt import Confirm
from rich import print, box
from employees import employees
from days import days

# Create table
schedule_table = Table(title="Employee Schedule", box=box.MINIMAL_HEAVY_HEAD, show_lines=True)
schedule_table.add_column("Name")
meta_table = Table(title="Day Metadata", box=box.MINIMAL_HEAVY_HEAD, show_lines=True)
meta_table.add_column("Parameter")

# Initial Parameters
emp_outside_hours = 2
twelve_hour = Confirm.ask("12 Hour Time?")  # Convert schedule to 12 hour time
hours = []

# Schedule employees for every day
for day_number, day in enumerate(days):
    # Add day to store hours row
    hours.append(display_time([day.opening, day.closing], day, twelve_hour))
    generate_day(employees, day, day_number, emp_outside_hours)

# Reduce the working days of overbooked_employees
reduce_time(employees, days, emp_outside_hours)

# Mark person as unscheduled (as an effect of reduce_time) instead of N/A
day_off = []
for day_number, day in enumerate(days):
    schedule_table.add_column(f"{day.name}", justify="center")
    meta_table.add_column(f"{day.name}", justify="center")
    day_off.append([])
    for employee in employees:
        if employee.availability[day_number] is not None and employee not in day.emp_working:
            day_off[-1].append(employee)

# Add hours to schedule table
meta_table.add_row("Hours", *hours, style="blue")
meta_table.add_row("Coverage", *[str(len(day.emp_working)) + " Working" for day in days])
meta_table.add_row("Opening", *[str(len(day.emp_opening)) + " Opening" for day in days], style="green")
meta_table.add_row("Closing", *[str(len(day.emp_closing)) + " Closing" for day in days], style="red")
meta_table.add_row("Day Off", 
    *["None" if not day else ", ".join([emp.name for emp in day]) for day in day_off],
    style="yellow"
)

# Display employees in alphabetical order (by name)
employees.sort(key=lambda employee: employee.name)
for employee in employees:
    schedule = []  # List of employee bookings

    # If employee isn't scheduled for a day, show N/A
    # If they are, display their opening and closing shifts
    for day_number, day in enumerate(days):
        if employee.scheduled[day_number] is None:
            if employee.availability[day_number] is None:
                schedule.append("[grey50]N/A")
            else:
                schedule.append("[yellow]Off")
        else:
            schedule.append(display_time([
                employee.scheduled[day_number].start,
                employee.scheduled[day_number].end
            ], day, twelve_hour))

    # Add employee to schedule
    schedule_table.add_row(employee.name, *schedule)

# Print tables
print(schedule_table)
print(meta_table)
