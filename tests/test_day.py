import unittest

from days import Day

class TestDays(unittest.TestCase):
    def setUp(self):
        self.days = [
            Day(11, 18),
            Day(8, 21),
        ]

    def test_day_slots(self):
        """
        Test if slots are properly dynamically generated based on hours
        """
        self.assertEqual(self.days[0].opening, self.days[0].slots[1][0])
        self.assertEqual(self.days[1].closing, self.days[1].slots[6][1])
        self.assertNotEqual(self.days[1].closing, self.days[1].slots[3][1])

    def test_hour_reductions(self):
        """Test that 8 hour slots are not added to < 8 hour work days"""
        self.assertIn([13, 18.5], self.days[0].slots)
        with self.assertRaises(IndexError):
            self.days[0].slots[7]

if __name__ == '__main__':
    unittest.main()
