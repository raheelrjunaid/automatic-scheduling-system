import unittest

from days import Slot

class TestSlots(unittest.TestCase):

    def test_slot_opening_closing(self):

        """
        Test if slot becomes an opening and closing slot based on hours provided
        """

        self.assertTrue(Slot(10.5, 18, 11, 19).opening_slot)
        self.assertFalse(Slot(10.5, 18, 11, 19).closing_slot)
        self.assertFalse(Slot(11, 21.5, 11, 21).opening_slot)

    def test_slot_incorrect_value(self):

        """
        Test if slot is made if negative/too large/too small integer is provided
        """

        with self.assertRaises(ValueError):
            Slot(11, -5, 11, 20)
        with self.assertRaises(ValueError):
            Slot(10.5, 23, 11, 20)
