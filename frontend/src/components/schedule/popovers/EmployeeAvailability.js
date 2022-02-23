import { Group, Button, ActionIcon, Select } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import { useForm } from "@mantine/hooks";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { HiMinus } from "react-icons/hi";
import axios from "axios";

export default function EmployeeAvailability({ dateData, handleSubmit }) {
  const [allEmployees, setAllEmployees] = useState([]);
  const [employeesAvailable, setEmployeesAvailable] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    async function getEmployees() {
      try {
        const response = await axios.get("/api/employees", {
          signal: controller.signal,
        });
        setAllEmployees(response.data.result);
      } catch (error) {
        console.log(error);
      }
    }
    async function getAvailablities() {
      try {
        const response = await axios.get(`/api/dates/${dateData.date}`, {
          signal: controller.signal,
        });
        console.log(response);
        const initalAvailability =
          response.data.result?.availability.map(({ start, end, ...rest }) => {
            return {
              start: dayjs(start).toDate(),
              end: dayjs(end).toDate(),
              ...rest,
            };
          }) || [];
        console.log(initalAvailability);
        setEmployeesAvailable(initalAvailability);
      } catch (error) {
        console.log(error);
      }
    }
    getAvailablities();
    getEmployees();

    return () => controller.abort();
  }, [dateData.date]);

  function deleteAvailability(index) {
    const updatedEmployeesAvailable = [...employeesAvailable];
    updatedEmployeesAvailable.splice(index, 1);
    setEmployeesAvailable(updatedEmployeesAvailable);
  }

  function handleChange(index, field, value) {
    const updatedEmployeesAvailable = [...employeesAvailable];
    updatedEmployeesAvailable[index][field] = value;
    setEmployeesAvailable(updatedEmployeesAvailable);
  }

  return (
    <Group direction="column">
      <Button
        onClick={() =>
          setEmployeesAvailable([
            ...employeesAvailable,
            {
              employee_id: null,
              start: new Date(dateData.date),
              end: new Date(dateData.date),
            },
          ])
        }
      >
        Add
      </Button>
      {employeesAvailable.map(({ employee_id, start, end }, index) => {
        // const employee = allEmployees.find(({ _id }) => _id === employee_id)
        return (
          <Group>
            <Select
              label="Employee"
              placeholder="Employee"
              required
              data={allEmployees.map(({ _id, name }) => {
                const first_name = name.split(" ")[0];
                return {
                  label: first_name[0].toUpperCase() + first_name.substr(1),
                  value: _id,
                };
              })}
              value={employee_id}
              onChange={(value) => handleChange(index, "employee_id", value)}
            />
            <TimeInput
              label="Start"
              required
              value={start}
              onChange={(value) => handleChange(index, "start", value)}
            />
            <TimeInput
              label="End"
              required
              value={end}
              onChange={(value) => handleChange(index, "end", value)}
            />
            <ActionIcon onClick={() => deleteAvailability(index)}>
              <HiMinus />
            </ActionIcon>
          </Group>
        );
      })}
      <Button onClick={() => handleSubmit(employeesAvailable)}>
        Save Changes
      </Button>
    </Group>
  );
}
