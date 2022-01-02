from random import sample
from time import strftime, gmtime

def potential_slot(employee_availability, day, emp_outside_hours):
    slots = day.slots[:]
    for slot in day.slots:
        if slot[0] < employee_availability[0] or slot[1] > employee_availability[1]:
            slots.remove(slot)
        elif slot[0] <= day.opening - .5 and len(day.emp_opening) >= emp_outside_hours:
            slots.remove(slot)
        elif slot[1] >= day.closing + .5 and len(day.emp_closing) >= emp_outside_hours:
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

def display_time(hours, day, twelve_hour):
    start = hours[0]
    end = hours[1]
    if twelve_hour:
        opening = strftime("%-I:%M%p", gmtime(start*60*60))
        closing = strftime("%-I:%M%p", gmtime(end*60*60))
    else:
        opening = strftime("%-H:%M", gmtime(start*60*60))
        closing = strftime("%-H:%M", gmtime(end*60*60))

    if start < day.opening:
        timing = f"[green bold]{opening}[/] - {closing}"
    elif end > day.closing:
        timing = f"{opening} - [red bold]{closing}"
    else:
        timing = f"{opening} - {closing}"

    return timing

