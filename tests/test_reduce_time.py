import unittest

from employees import Employee
from days import Day
from functions import reduce_time, generate_day

class TestReduceTime(unittest.TestCase):

    def setUp(self):
        self.emp_1 = Employee("monica", 
                [[0, 23], [0, 23], [0, 23], [0, 23]], max_working_days=2)
        self.emp_2 = Employee("rachel", 
                [[0, 23], None, [0, 23], [0, 23]], max_working_days=2)
        self.emp_3 = Employee("chandler", 
                [[0, 23], [0, 23], [0, 23], None], max_working_days=2)
        self.emp_4 = Employee("joey", 
                [[0, 23], [0, 23], [0, 23], [0, 23]], max_working_days=2)
        self.emp_5 = Employee("ross", 
                [[0, 23], [0, 23], None, None], max_working_days=2)

        self.day_1 = Day(9, 22, name="day_1", max_emp_working=2)
        self.day_2 = Day(9, 22, name="day_2", max_emp_working=2)
        self.day_3 = Day(9, 22, name="day_3", max_emp_working=2)
        self.day_4 = Day(9, 22, name="day_4", max_emp_working=2)

        self.emps = [self.emp_1, self.emp_2, self.emp_3, self.emp_4, self.emp_5]
        self.days = [self.day_1, self.day_2, self.day_3, self.day_4]

        self.result = reduce_time(self.emps, self.days, 1)

    def test_maximum_working_days(self):
        """
        Test if employees are booked for more than their maximum working days
        """
        if self.result:
            for emp in self.emps:
                emp_scheduled_days = [slot for slot in emp.scheduled if slot is not None]
                self.assertLessEqual(len(emp_scheduled_days), emp.max_working_days)

if __name__ == "__main__":
    unittest.main()
