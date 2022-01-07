import unittest

from functions import generate_day, unbook_employee
from days import Day, Slot
from employees import Employee

class TestBookings(unittest.TestCase):

    def setUp(self):
        self.emp_1 = Employee("phoebe", [None, [11, 20]])
        self.day_1 = Day(11, 20)
        self.day_2 = Day(12, 21)
        self.days = [self.day_1, self.day_2]
        for day_number, day in enumerate(self.days):
            generate_day([self.emp_1], day, day_number, 1)

    def test_employee_not_available(self):
        """
        Test if employee is booked if they aren’t available on that day
        """
        self.assertEqual(self.day_1.emp_working, [])
        self.assertFalse(self.emp_1.scheduled[0])

    def test_opening_priority(self):
        """
        Test if employee is prioritized for opening if they have any available
        opening slots
        """
        self.assertEqual(self.emp_1.scheduled[1].status, "opening")

    def test_fixed_hours(self):
        """
        Test if employee is booked for the slot provided if they have fixed
        hours
        """
        emp_2 = Employee("joey", [
            Slot(11, 20.5, self.day_1.opening, self.day_1.closing),
            Slot(11.5, 17, self.day_2.opening, self.day_2.closing)],
            fixed_hours=True
        )
        for day_number, day in enumerate(self.days):
            generate_day([emp_2], day, day_number, 1)
        self.assertEqual(emp_2.scheduled[0].start, emp_2.availability[0].start)
        self.assertEqual(emp_2.scheduled[0].end, emp_2.availability[0].end)
        self.assertEqual(emp_2.scheduled[1].start, emp_2.availability[1].start)
        self.assertEqual(emp_2.scheduled[1].end, emp_2.availability[1].end)

class TestLogBookings(unittest.TestCase):

    def setUp(self):
        self.emp_1 = Employee("phoebe", [[11, 21]])
        self.day_1 = Day(12, 21)
        generate_day([self.emp_1], self.day_1, 0, 1)

    def test_employee_working(self):
        """
        Test if day has logged that the employee is opening/closing/working
        """
        self.assertIn(self.emp_1, self.day_1.emp_opening)
        self.assertIn(self.emp_1, self.day_1.emp_working)

    def test_unbook(self):
        """
        Test if employee can be unbooked
        """
        unbook_employee(self.emp_1, self.day_1, 0)
        self.assertNotIn(self.emp_1, self.day_1.emp_working)
        self.assertEqual(self.emp_1.scheduled[0], None)
