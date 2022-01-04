from random import sample
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
            elif slot.opening_slot and len(day.emp_opening) >= emp_outside_hours:
                slots.remove(slot)
            elif slot.closing_slot and len(day.emp_closing) >= emp_outside_hours:
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
def book_employee(employee, slots, day):
    if slots is None: # Employee isn't available
        employee.scheduled.append(None)
    else:
        # If slots is a list, employee doesn't have fixed hours
        if type(slots) is list:
            # Prioritize opening and closing shifts where needed
            if any(list(map(lambda slot: slot.opening_slot, slots))):
                slots = [slot for slot in slots if slot.opening_slot]
            if any(list(map(lambda slot: slot.closing_slot, slots))):
                slots = [slot for slot in slots if slot.closing_slot]

            # Choose random shift
            slot = sample(slots, 1)[0]

        else:
            slot = slots

        # Mark them as an opening/closing employee
        if slot.opening_slot:
            day.emp_opening.append(employee)
        if slot.closing_slot:
            day.emp_closing.append(employee)

        # Schedule employee
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
