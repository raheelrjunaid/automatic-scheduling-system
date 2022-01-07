import unittest

from days import Slot

class TestSlots(unittest.TestCase):

    def test_slot_opening_closing(self):
        """
        Test if slot becomes an opening and closing slot based on hours provided
        """
        self.assertEqual(Slot(10.5, 18, 11, 19).status, "opening")
        self.assertFalse(Slot(12, 18, 11, 19).status)
        self.assertNotEqual(Slot(10.5, 18, 11, 19).status, "closing")
        self.assertNotEqual(Slot(11, 21.5, 11, 21).status, "opening")

    def test_slot_incorrect_value(self):
        """
        Test if slot is made if negative/too large/too small integer is provided
        """
        with self.assertRaises(ValueError):
            Slot(11, -5, 11, 20)
        with self.assertRaises(ValueError):
            Slot(10.5, 23, 11, 20)
