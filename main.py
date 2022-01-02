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

# Schedule employees for every day
for day_number, day in enumerate(days):
    # Add a day column to the calendar because I can
    schedule_table.add_column(day.name.capitalize(), justify="center")
    # Add day to store hours row
    hours.append(display_time([day.opening, day.closing], day, twelve_hour))

    # Prioritize fixed hour employees
    for employee in fixed_employees:
        employee_hours = employee.availability[day_number]
        book_employee(employee, employee_hours, day)

    # Randomize employee order every day
    # This prevents bias towards employees based on order
    shuffle(reg_employees) 
    for employee in reg_employees:
        employee_availability = employee.availability[day_number]

        # If employee is available (does not equal None)
        if employee_availability:
            potential_slots = potential_slot(employee_availability, day, emp_outside_hours)

            # Assign custom hours for special availabilities
            if potential_slots == []:
                # If they're available for an opening shift
                if employee_availability[0] < day.opening - .5:
                    # If we don't need them for opening
                    if len(day.emp_opening) >= emp_outside_hours:
                        employee_availability[0] = day.opening
                    else:
                        employee_availability[0] = day.opening - .5

                # If they're available for an closing shift
                elif employee_availability[1] > day.closing + .5:
                    # If we don't need them for closing
                    if len(day.emp_closing) >= emp_outside_hours:
                        employee_availability[1] = day.closing
                    else:
                        employee_availability[1] = day.closing + .5

                book_employee(employee, employee_availability, day)
            
            else: # If they have some slots available, randomly select one
                book_employee(employee, potential_slots, day)

        else: # Not available
            employee.scheduled.append(None)

schedule_table.add_row("Hours", *hours, style="black on yellow") # Add hours to schedule table

# Display employees in alphabetical order (by name)
employees.sort(key=lambda employee : employee.name)
for employee in employees:
    schedule = [] # List of employee bookings

    # If employee isn't scheduled for a day, show N/A
    # If they are, display their opening and closing shifts
    for day_number, day in enumerate(days):
        if employee.scheduled[day_number] == None:
            schedule.append("[grey50]N/A")
        else:
            schedule.append(display_time([employee.scheduled[day_number][0], \
            employee.scheduled[day_number][1]], day, twelve_hour))

    # Add employee to schedule
    schedule_table.add_row(employee.name.capitalize(), *schedule)

# Print table
print("\n[bold green]Green[/] indicates opening shift.")
print("[bold red]Red[/] indicates closing shift.\n")
print(schedule_table)
