import unittest

from functions import potential_slot, book_employee
from days import Day, Slot
from employees import Employee

class TestBookings(unittest.TestCase):

    def setUp(self):
        self.emp_1 = Employee("phoebe", [None, [11, 23]])
        self.day_1 = Day(11, 20)
        self.day_2 = Day(12, 21)

    def test_employee_not_available(self):
        """
        Test if employee is booked if they aren’t available on that day
        """
        slot = potential_slot(self.emp_1.availability[0], self.day_1, 2)
        book_employee(self.emp_1, slot, self.day_1)
        self.assertFalse(slot)
        self.assertFalse(self.emp_1.scheduled[0])

    def test_opening_priority(self):
        """
        Test if employee is prioritized for opening if they have any available
        opening slots
        """
        slots = potential_slot(self.emp_1.availability[1], self.day_2, 2)
        book_employee(self.emp_1, slots, self.day_2)
        self.assertEqual(self.day_2.slots[0].start, self.emp_1.scheduled[0].start)
        self.assertEqual(self.day_2.slots[4].start, self.emp_1.scheduled[0].start)

    def test_fixed_hours(self):
        """
        Test if employee is booked for the slot provided if they have fixed
        hours
        """
        emp_2 = Employee("joey", [[11, 19], [9.5, 17]], fixed_hours=True)
        book_employee(emp_2, Slot(*emp_2.availability[0], self.day_1.opening, self.day_1.closing), self.day_1)
        self.assertEqual(emp_2.scheduled[0].start, emp_2.availability[0][0])
        self.assertEqual(emp_2.scheduled[0].end, emp_2.availability[0][1])

    def test_employee_scheduled(self):
        """
        Test if employee has logged being scheduled for that slot
        """
        slots = potential_slot(self.emp_1.availability[1], self.day_2, 2)
        book_employee(self.emp_1, slots, self.day_1)
        self.assertIn(self.emp_1.scheduled[0], slots)

    def test_employee_working(self):
        """
        Test if day has logged that the employee is opening/closing/working
        """
        slots = potential_slot(self.emp_1.availability[1], self.day_2, 2)
        book_employee(self.emp_1, slots, self.day_2)
        self.assertIn(self.emp_1, self.day_2.emp_opening)
        self.assertIn(self.emp_1, self.day_2.emp_working)
