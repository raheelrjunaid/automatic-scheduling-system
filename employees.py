class Employee:
   def __init__(self, name, availability, max_working_days=5, fixed_hours=False):
        self.name = name
        self.fixed_hours = fixed_hours
        self.availability = availability
        self.scheduled = []
        self.max_working_days = max_working_days

from days import days

# Variable Fixed Hours
bandish = Employee("bandish", [
    None,
    days[1].slots[0 if days[1].duration < 8 else 4],
    days[2].slots[0 if days[2].duration < 8 else 4],
    days[3].slots[0 if days[3].duration < 8 else 4],
    days[4].slots[0 if days[4].duration < 8 else 4],
    days[5].slots[0 if days[5].duration < 8 else 4],
    None
], fixed_hours=True)

jasmine = Employee("jasmine", [
    None,
    days[1].slots[3 if days[1].duration < 8 else 7],
    days[2].slots[3 if days[2].duration < 8 else 7],
    days[3].slots[3 if days[3].duration < 8 else 7],
    days[4].slots[3 if days[4].duration < 8 else 7],
    days[5].slots[3 if days[5].duration < 8 else 7],
    None,
], fixed_hours=True)

# Regular Hours
raheel = Employee("raheel", [[0, 23], None, [16, 23], None, [16, 23], [15, 23], [0, 23]])

therese = Employee("therese", [[10.5, 18.50], [12, 20.50], [12, 20.50], [12, 20.50], [13, 21.50], [13, 21.50], [9.30, 22]])

jamie = Employee("jamie", [[0, 23], [0, 23], [0, 23], [0, 23], [0, 23], [0, 23], [0, 23]])

aaron = Employee("aaron", [[0, 23], [0, 23], [0, 23], [0, 23], [0, 23], [0, 23], [0, 23]])

ben_o = Employee("ben o", [None, None, None, None, None, [0, 23], [0, 23]])

ben_a = Employee("ben a", [[11, 18], None, [10, 18], [12, 20], [12, 20], None, [10, 18],])

monica = Employee("monica", [[0, 23], None, None, [16.5, 21], None, [16.5, 21], None])

employees = [raheel, monica, ben_a, jamie, jasmine, therese, bandish, aaron, ben_o]
