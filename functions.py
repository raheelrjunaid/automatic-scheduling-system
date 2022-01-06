from random import sample, shuffle, randint
from pudb import set_trace
from time import strftime, gmtime
from days import Slot

# Narrow down available time slots based on availability
def potential_slot(emp_availability, day, emp_outside_hours):
    if emp_availability is not None:
        slots = day.slots[:]  # Available slots copy
        for slot in day.slots:
            if slot.start < emp_availability[0] or slot.end > emp_availability[1]:
                slots.remove(slot)
            # Remove slots if they aren't needed for closing or opening
            elif slot.status == "opening" and len(day.emp_opening) >= emp_outside_hours:
                slots.remove(slot)
            elif slot.status == "closing" and len(day.emp_closing) >= emp_outside_hours:
                slots.remove(slot)

        if slots == []:  # Custom schedule outside of slots
            # If they're available for an opening shift
            if emp_availability[0] < day.opening - .5:
                # If we don't need them for opening
                if len(day.emp_opening) >= emp_outside_hours:
                    emp_availability[0] = day.opening
                else:
                    emp_availability[0] = day.opening - .5

            # If they're available for an closing shift
            if emp_availability[1] > day.closing + .5:
                # If we don't need them for closing
                if len(day.emp_closing) >= emp_outside_hours:
                    emp_availability[1] = day.closing
                else:
                    emp_availability[1] = day.closing + .5

            return Slot(emp_availability[0], emp_availability[1],
                        day.opening, day.closing)

    else:
        slots = None  # Don't allow them to be booked

    return slots

# Add day to employee schedule
def book_employee(employee, slots, day, day_number=False):
    if slots is None: # Employee isn't available
        employee.scheduled.append(None)
        return
    # If slots is a list, employee doesn't have fixed hours
    if type(slots) is list:
        # Prioritize opening and closing shifts where needed
        special_slots = []
        if any(list(map(lambda slot: slot.status == "opening", slots))):
            special_slots.extend([slot for slot in slots if slot.status == "opening"])
        if any(list(map(lambda slot: slot.status == "closing", slots))):
            special_slots.extend([slot for slot in slots if slot.status == "closing"])

        if special_slots != []:
            # Choose random opening/closing shift
            slot = sample(special_slots, 1)[0]
        else:
            # Choose random shift
            slot = sample(slots, 1)[0]
    # Employee has fixed hours
    else:
        slot = slots

    # Mark them as an opening/closing employee
    if slot.status == "opening":
        day.emp_opening.append(employee)
    if slot.status == "closing":
        day.emp_closing.append(employee)

    if type(day_number) == int:
        employee.scheduled[day_number] = slot
    else:
        employee.scheduled.append(slot)

    day.emp_working.append(employee)

# Display hours in 24/12 hour time
def display_time(hours, day, twelve_hour):
    start = hours[0]
    end = hours[1]
    if twelve_hour:
        opening = strftime("%-I:%M%p", gmtime(start*60*60))
        closing = strftime("%-I:%M%p", gmtime(end*60*60))
    else:
        opening = strftime("%-H:%M", gmtime(start*60*60))
        closing = strftime("%-H:%M", gmtime(end*60*60))
    
    # Highlight opening or closing
    if start < day.opening:
        timing = f"[green bold]{opening}[/] - {closing}"
    elif end > day.closing:
        timing = f"{opening} - [red bold]{closing}"
    else:
        timing = f"{opening} - {closing}"

    return timing

# Remove employee from scheduled day
def unbook_employee(employee, day, day_number):

    if employee.scheduled[day_number].status == "opening":
        day.emp_opening.remove(employee)
    elif employee.scheduled[day_number].status == "closing":
        day.emp_closing.remove(employee)

    employee.scheduled[day_number] = None
    day.emp_working.remove(employee)

def calc_overbooked_emps(employees):
    overbooked_employees = []
    for employee in employees:
        scheduled_slots = [slot for slot in employee.scheduled if slot is not None] 
        if len(scheduled_slots) > employee.max_working_days:
            overbooked_employees.append(employee)
    return overbooked_employees

def reduce_time(employees, days, emp_outside_hours):
    if type(employees) is not list or len(employees) <= 0:
        raise Exception("List of Employees Required")
    elif type(days) is not list or len(days) <= 0:
        raise Exception("List of Days Required")

    overbooked_employees = calc_overbooked_emps(employees)

    iteration_count = 0
    while overbooked_employees != []:
        iteration_count += 1

        if iteration_count == len(employees) * len(days):
            print("MANUAL INPUT NEEDED. OVERBOOKED EMPLOYEES:",
                *list(map(lambda emp: emp.name, overbooked_employees)))
            return False

        days_sorted_by_coverage = days[:]
        days_sorted_by_coverage.sort(key=lambda day: len(day.emp_working), reverse=True)

        days_coverage = [len(day.emp_working) for day in days_sorted_by_coverage]
        random_removal_list = []
        for i in range(0, len(days_sorted_by_coverage)):
            if days_coverage[0] == days_coverage[i]:
                random_removal_list.append(days_sorted_by_coverage[i])
            else:
                break

        shuffle(random_removal_list)

        for day in random_removal_list:

            overbooked_employees = calc_overbooked_emps(employees)
            if overbooked_employees == []:
                # set_trace()
                # result = calc_overbooked_emps(employees)
                return True
            else:
                emps_to_be_removed = overbooked_employees[:]

            for emp in overbooked_employees:
                if emp not in day.emp_working:
                    emps_to_be_removed.remove(emp)
                else:
                    emp_slot = emp.scheduled[days.index(day)]
                    if emp_slot.status:
                        emps_to_be_removed.remove(emp)

            if emps_to_be_removed != []:
                # set_trace()
                unbook_employee(emps_to_be_removed[randint(0, len(emps_to_be_removed) - 1)],
                        day, days.index(day))
            else:
                generate_day(employees, day, days.index(day), emp_outside_hours, toggle=True)

def generate_day(employees, day, day_number, emp_outside_hours, toggle=False):
    if day.emp_working != []:
        emps_working = day.emp_working[:]
        for emp in emps_working:
            unbook_employee(emp, day, day_number)

    fixed_employees = [employee for employee in employees if employee.fixed_hours]
    reg_employees = [employee for employee in employees if not employee.fixed_hours]

    # Prioritize fixed hour employees
    for employee in fixed_employees:
        emp_hours = employee.availability[day_number]
        book_employee(employee, emp_hours, day)

    # Randomize employee order every day
    # This prevents bias towards employees based on order
    shuffle(reg_employees)
    for employee in reg_employees:
        emp_availability = employee.availability[day_number]

        # If employee is available (does not equal None)
        if emp_availability:
            potential_slots = potential_slot(emp_availability, day, emp_outside_hours)
            if toggle:
                book_employee(employee, potential_slots, day, day_number)
            else:
                book_employee(employee, potential_slots, day)

        else:  # Not available
            employee.scheduled.append(None)
