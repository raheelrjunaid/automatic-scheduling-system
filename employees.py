class Employee():
   def __init__(self, name, availability, fixed_hours=False):
        self.name = name
        self.fixed_hours = fixed_hours
        self.availability = availability
        self.scheduled = []
        self.call_back_days = []

bandish = Employee("bandish", [
    None,
    [930, 1800],
    [930, 1800],
    [930, 1800],
    [930, 1800],
    [930, 1800],
    None
], fixed_hours=True)

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
    [0, 2300],
    [0, 2300],
    [0, 2300],
    [0, 2300],
    [0, 2300],
    [0, 2300],
    [0, 2300],
])

aaron = Employee("aaron", [
    [0, 2300],
    [0, 2300],
    [0, 2300],
    [0, 2300],
    [0, 2300],
    [0, 2300],
    [0, 2300],
])

ben_o = Employee("ben o", [
    None,
    None,
    None,
    None,
    None,
    [0, 2300],
    [0, 2300],
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
    [0, 2300],
    None,
    None,
    [1630, 2100],
    None,
    [1630, 2100],
    None
])

employees = [monica, ben_a, jamie, jasmine, therese, bandish, aaron, ben_o]
