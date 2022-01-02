class Day():
    def __init__(self, name, opening, closing):
        self.name = name
        self.emp_working = []
        self.emp_closing = []
        self.emp_opening = []
        self.opening = opening
        self.closing = closing
        self.slots = [
            [opening - 70, opening + 500],
            [opening, opening + 500],
            [closing - 500, closing],
            [closing - 500, closing + 30],
        ]
        self.duration = self.closing - self.opening
        
        if self.duration >= 800:
            self.slots.extend([
                [opening - 70, opening + 800],
                [opening, opening + 800],
                [closing - 800, closing],
                [closing - 800, closing + 30]
            ])

sunday = Day("sunday", 1100, 1800)
monday = Day("monday", 1100, 2000)
tuesday = Day("tuesday", 1100, 2000)
wednesday = Day("wednesday", 1100, 2000)
thursday = Day("thursday", 1000, 2100)
friday = Day("friday", 1000, 2100)
saturday = Day("saturday", 1100, 1800)

days = [sunday, monday, tuesday, wednesday, thursday, friday, saturday]
