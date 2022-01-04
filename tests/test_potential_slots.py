import unittest

from functions import potential_slot, book_employee
from employees import Employee
from days import Day

class TestPotentialSlots(unittest.TestCase):

    def setUp(self):
        self.emp_1 = Employee("monica", [[10, 23]])
        self.emp_2 = Employee("chandler", [[11, 23], None])
        self.emp_3 = Employee("rachel", [[12, 23]])

        self.day_1 = Day(10, 22)

    def test_employee_availability_time(self):
        """
        Test if slots are removed if employee is not available for that time
        """
        slots = potential_slot(self.emp_3.availability[0], self.day_1, 2)

        self.assertNotIn(self.day_1.slots[0], slots)
        self.assertIn(self.day_1.slots[3], slots)
        self.assertIn(self.day_1.slots[7], slots)

    def test_employee_availability_none(self):
        """
        Test if slots are removed if employee is not available for that day
        """
        day_2 = Day(9, 20)
        slot = potential_slot(self.emp_2.availability[1], day_2, 2)
        self.assertFalse(slot)

    def test_employee_custom_slot(self):
        """
        Test if employee is given a custom slot according to their availability
        """
        emp_4 = Employee("ross", [[12, 21]])
        slot = potential_slot(emp_4.availability[0], self.day_1, 2)
        self.assertEqual(12, slot.start)
        self.assertEqual(21, slot.end)

    def test_employee_closing(self):
        """
        Test if employee is booked if they aren't needed for opening or closing
        """
        slots_1 = potential_slot(self.emp_1.availability[0], self.day_1, 2)
        book_employee(self.emp_1, slots_1, self.day_1)

        slots_2 = potential_slot(self.emp_2.availability[0], self.day_1, 2)
        book_employee(self.emp_2, slots_2, self.day_1)

        slots_3 = potential_slot(self.emp_3.availability[0], self.day_1, 2)
        book_employee(self.emp_3, slots_3, self.day_1)

        self.assertNotIn(self.emp_3, self.day_1.emp_closing)
