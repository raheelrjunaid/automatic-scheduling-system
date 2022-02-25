import { useEffect, useState } from "react";
import Day from "./Day";
import { Text, Group, SimpleGrid, Title, Table } from "@mantine/core";
import { getMonthDays, getWeekdaysNames } from "@mantine/dates";
import dayjs from "dayjs";
import WeekSelector from "./WeekSelector";
import axios from "axios";

export default function ScheduleSection() {
  const [month, setMonth] = useState(new Date());
  const [selectedWeek, setSelectedWeek] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeSchedules, setEmployeeSchedules] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    async function setAllEmployees() {
      const response = await axios("/api/employees", {
        signal: controller.signal,
      });
      setEmployees(response.data.result);
    }

    setAllEmployees();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    function getEmployeeSchedules() {
      const updatedEmployeeSchedules = [];
      employees.map(async (employee) => {
        await Promise.all(
          selectedWeek.map(async (date) => {
            const response = await axios.get(
              `/api/dates/${dayjs(date).format()}`
            );
            if (response.data.result) {
              const employeeHours = response.data.result.emps_working?.find(
                (_employee) => _employee.employee_id === employee._id
              );
              const employeeAvailability =
                response.data.result.availability?.find(
                  (_employee) => _employee.employee_id === employee._id
                );
              return {
                working: employeeHours,
                availability: employeeAvailability,
              };
            }
            return null;
          })
        ).then((schedule) => {
          setEmployeeSchedules([
            ...updatedEmployeeSchedules,
            {
              employee,
              schedule,
            },
          ]);
        });
      });
    }
    getEmployeeSchedules();
  }, [selectedWeek, employees]);

  // TODO finish making week view

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
          <SimpleGrid cols={7} sx={{ flexGrow: 1 }}>
            {getWeekdaysNames("en", "sunday").map((weekday) => (
              <Text key={weekday}>{weekday}</Text>
            ))}
            {getMonthDays(month, "sunday").map((week) =>
              week.map((day, index) => <Day day={day} key={index} />)
            )}
          </SimpleGrid>
        ) : (
          <Table striped sx={{ flexGrow: 1, width: "auto" }}>
            <thead>
              <tr>
                <th>Employee</th>
                {selectedWeek.map((day, index) => (
                  <th key={index}>{day.format("ddd, D")}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {employeeSchedules.map(({ employee, schedule }) => (
                <tr key={`${selectedWeek[0].date()}${employee._id}`}>
                  <td>
                    <Text>{employee.name}</Text>
                  </td>
                  {schedule.map((date, index) => {
                    if (date) {
                      return (
                        <td
                          key={`${employee._id}${selectedWeek[index].date()}`}
                        >
                          <Text>
                            {date.working
                              ? `${dayjs(date.working.start).hour()} - ${dayjs(
                                  date.working.end
                                ).hour()}`
                              : "Not working"}
                          </Text>
                          <Text>
                            {date.availability
                              ? `${dayjs(
                                  date.availability.start
                                ).hour()} - ${dayjs(
                                  date.availability.end
                                ).hour()}`
                              : "Not available"}
                          </Text>
                        </td>
                      );
                    }
                    return (
                      <td key={`${index}${employee.name}`}>
                        <Text>N/A</Text>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Group>
    </section>
  );
}
