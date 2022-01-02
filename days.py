class Day():
    def __init__(self, name, opening, closing):
        self.name = name
        self.emp_working = []
        self.emp_closing = []
        self.emp_opening = []
        self.opening = opening
        self.closing = closing
        self.slots = [
            [opening - .5, opening + 5],
            [opening, opening + 5],
            [closing - 5, closing],
            [closing - 5, closing + .5],
        ]
        self.duration = self.closing - self.opening
        
        if self.duration >= 8:
            self.slots.extend([
                [opening - .5, opening + 8],
                [opening, opening + 8],
                [closing - 8, closing],
                [closing - 8, closing + .5]
            ])

sunday = Day("sunday", 11, 18)
monday = Day("monday", 11, 20)
tuesday = Day("tuesday", 11, 20)
wednesday = Day("wednesday", 11, 20)
thursday = Day("thursday", 10, 21)
friday = Day("friday", 10, 21)
saturday = Day("saturday", 11, 18)

days = [sunday, monday, tuesday, wednesday, thursday, friday, saturday]
