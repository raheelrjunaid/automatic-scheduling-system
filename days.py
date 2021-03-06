class Slot:
    def __init__(self, start, end, open_time, close_time):

        self.start = start
        self.end = end
        self.status = None
        
        if start < 0:
            raise ValueError("Slot start cannot be negative")
        if end < 0:
            raise ValueError("Slot end cannot be negative")
        
        if start < open_time:
            if open_time - start > .5:
                raise ValueError(f"Slot cannot start {open_time - start} hours early")
            else:
                self.status = "opening"
        if end > close_time:
            if end - close_time > .5:
                raise ValueError(f"Slot cannot end {end - close_time} hours end")
            else:
                self.status = "closing"
            
class Day:
    def __init__(self, opening, closing, name=None):

        if name:
            self.name = name.capitalize()
        self.emp_working = []
        self.emp_closing = []
        self.emp_opening = []
        self.opening = opening
        self.closing = closing

        self.slots = [
            Slot(opening - .5, opening + 5, opening, closing),
            Slot(opening, opening + 5, opening, closing),
            Slot(closing - 5, closing, opening, closing),
            Slot(closing - 5, closing + .5, opening, closing)
        ]
        self.duration = self.closing - self.opening
        
        if self.duration >= 8:
            self.slots.extend([
                Slot(opening - .5, opening + 8, opening, closing),
                Slot(opening, opening + 8, opening, closing),
                Slot(closing - 8, closing, opening, closing),
                Slot(closing - 8, closing + .5, opening, closing)
            ])

sunday = Day(11, 18, "sunday")
monday = Day(11, 20, "monday")
tuesday = Day(11, 20, "tuesday")
wednesday = Day(11, 20, "wednesday")
thursday = Day(10, 21, "thursday")
friday = Day(10, 21, "friday")
saturday = Day(11, 18, "saturday")

days = [sunday, monday, tuesday, wednesday, thursday, friday, saturday]
