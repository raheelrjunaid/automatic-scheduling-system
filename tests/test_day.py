import unittest

from days import Day

class TestDays(unittest.TestCase):

    def setUp(self):
        self.day_1 = Day(11, 18)
        self.day_2 = Day(8, 21)

    def test_day_slots(self):
        """
        Test if slots are properly dynamically generated based on hours
        """
        self.assertEqual(11, self.day_1.slots[1].start)
        self.assertEqual(21, self.day_2.slots[6].end)
        self.assertNotEqual(21, self.day_2.slots[3].end)

    def test_hour_reductions(self):
        """Test that 8 hour slots are not added to < 8 hour work days"""
        self.assertEqual(10.5, self.day_1.slots[0].start)
        self.assertEqual(18.5, self.day_1.slots[3].end)
        with self.assertRaises(IndexError):
            self.day_1.slots[7]
