import { useMantineTheme } from "@mantine/core";
import { RangeCalendar, isSameDate } from "@mantine/dates";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function WeekSelector({
  selectedWeek,
  setSelectedWeek,
  onMonthChange,
}) {
  const [value, setValue] = useState([null, null]);
  const [hoveredWeek, setHoveredWeek] = useState([]);
  const theme = useMantineTheme();

  useEffect(() => {
    setValue([selectedWeek[0]?.toDate(), selectedWeek[6]?.toDate()]);
  }, [selectedWeek]);

  function hoverOnDay(date) {
    const hoveredDay = dayjs(date);
    const currentDay = hoveredDay.subtract(hoveredDay.day(), "day");
    const updatedHoveredWeek = [];
    for (let i = 0; i < 7; i++) {
      updatedHoveredWeek.push(currentDay.add(i, "day"));
    }
    setHoveredWeek(updatedHoveredWeek);
  }

  return (
    <RangeCalendar
      value={value}
      onChange={() => setSelectedWeek(hoveredWeek)}
      onDayMouseEnter={hoverOnDay}
      onMonthChange={onMonthChange}
      onMouseLeave={() => setHoveredWeek([])}
      firstDayOfWeek="sunday"
      dayStyle={(hoveredDay) =>
        hoveredWeek.find((date) => isSameDate(date.toDate(), hoveredDay))
          ? { backgroundColor: theme.colors.dark[5] }
          : null
      }
    />
  );
}
