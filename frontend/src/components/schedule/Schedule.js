import { useEffect, useState } from "react";
import Day from "./Day";
import { Text, Group, SimpleGrid, Title, Table } from "@mantine/core";
import { getMonthDays, getWeekdaysNames, isSameDate } from "@mantine/dates";
import WeekSelector from "./WeekSelector";
import { getDocs, onSnapshot, query, where } from "firebase/firestore";
import { availabilitiesRef, employeesRef } from "../..";

export default function ScheduleSection() {
  const [month, setMonth] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);

  // Get all employees to create new availabilities
  useEffect(() => {
    const employeeUnsub = onSnapshot(employeesRef, (snapshot) => {
      setEmployees(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => employeeUnsub();
  }, []);

  // Week View: Set employees working and availability status based on selected week
  useEffect(() => {
    async function getEmployeeSchedules() {
      if (selectedWeek.length > 0) {
        const availabilitiesQuery = query(
          availabilitiesRef,
          where("date", ">=", selectedWeek[0].toDate()),
          where("date", "<=", selectedWeek[6].toDate())
        );
        const result = await getDocs(availabilitiesQuery);
        setAvailabilities(
          result.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      }
    }

    getEmployeeSchedules();
  }, [selectedWeek]);

  return (
    <section>
      <Title order={1} align="center">
        Schedule
      </Title>

      <Group align="flex-start">
        <WeekSelector
          selectedWeek={selectedWeek}
          setSelectedWeek={setSelectedWeek}
          onMonthChange={(date) => {
            setMonth(date);
            setSelectedWeek([]);
          }}
        />
        {selectedWeek.length === 0 ? (
          // MONTH VIEW
          <SimpleGrid cols={7} sx={{ flexGrow: 1 }}>
            {getWeekdaysNames("en", "sunday").map((weekday) => (
              <Text key={weekday}>{weekday}</Text>
            ))}
            {getMonthDays(month, "sunday").map((week) =>
              week.map((day, index) => <Day day={day} key={index} />)
            )}
          </SimpleGrid>
        ) : (
          // WEEK VIEW
          <Table striped sx={{ flexGrow: 1, width: "auto" }}>
            {/* Header section */}
            <thead>
              <tr>
                <th>Employee</th>
                {selectedWeek.map((day, index) => (
                  <th key={index}>{day.format("ddd, D")}</th>
                ))}
              </tr>
            </thead>

            {/* Body section */}
            <tbody>
              {/* Iterate over each employee to generate a row */}
              {employees.map(({ name, id }) => {
                return (
                  <tr key={id}>
                    <td>{name}</td>
                    {selectedWeek.map((day) => {
                      // Find possible employee availability for that day
                      const dayAvailability = availabilities.find(
                        ({ date, employeeId }) =>
                          isSameDate(day.toDate(), date.toDate()) &&
                          id === employeeId
                      );
                      // Show employee availability if they're available
                      return (
                        <td>
                          {dayAvailability
                            ? `${dayAvailability.start
                                .toDate()
                                .getHours()} - ${dayAvailability.end
                                .toDate()
                                .getHours()}`
                            : "N/A"}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Group>
    </section>
  );
}
