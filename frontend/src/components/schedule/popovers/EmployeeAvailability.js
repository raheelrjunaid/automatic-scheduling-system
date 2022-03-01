import { Group, Button, ActionIcon, Select } from "@mantine/core";
import { TimeInput } from "@mantine/dates";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { HiMinus } from "react-icons/hi";
import axios from "axios";
import {
  addDoc,
  deleteDoc,
  doc,
  endAt,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, employeesRef, availabilitiesRef } from "../../..";

export default function EmployeeAvailability({ dateData }) {
  const [employees, setEmployees] = useState([]);
  const [availabilities, setAvailabilities] = useState([]);

  useEffect(() => {
    // Set all employees for selection in form
    async function getEmployees() {
      try {
        const result = await getDocs(employeesRef);
        setEmployees(result.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.log(error);
      }
    }

    // Get initial availabilities for employees
    // Used for populating list of employee availability for each day
    async function getAvailablities() {
      try {
        const queryRef = query(
          availabilitiesRef,
          where("date", "==", dateData.date)
        );
        const result = await getDocs(queryRef);

        if (result.docs.length > 0) {
          setAvailabilities(
            result.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        }
      } catch (error) {
        console.log(error);
      }
    }

    getAvailablities();
    getEmployees();
  }, [dateData.date]);

  // TODO Delete availabilities on click
  function deleteAvailability(index) {
    // If employee has been created in firestore
    if (availabilities[index].id) {
      const docRef = doc(db, "availabilities", availabilities[index].id);
      deleteDoc(docRef);
    }
    const updatedEmployeesAvailable = [...availabilities];
    updatedEmployeesAvailable.splice(index, 1);
    setAvailabilities(updatedEmployeesAvailable);
  }

  function handleChange(index, field, value) {
    const updatedEmployeesAvailable = [...availabilities];
    updatedEmployeesAvailable[index][field] = value;
    setAvailabilities(updatedEmployeesAvailable);
  }

  function handleSubmit() {
    availabilities.forEach((availability) => {
      const { id, ...data } = availability;
      if (id) {
        const docRef = doc(db, `availabilities`, id);
        updateDoc(docRef, data);
      } else {
        addDoc(availabilitiesRef, {
          ...data,
          date: Timestamp.fromDate(dateData.date),
        });
      }
    });
  }

  // FIXME When removing last employee availability, popover exits

  return (
    <Group direction="column">
      <Button
        onClick={() =>
          setAvailabilities([
            ...availabilities,
            {
              employeeId: "",
              start: Timestamp.fromDate(dateData.date),
              end: Timestamp.fromDate(dateData.date),
            },
          ])
        }
      >
        Add
      </Button>

      {availabilities.map(({ employeeId, start, end, id }, index) => (
        <Group key={index}>
          <Select
            label="Employee"
            placeholder="Employee"
            required
            data={employees.map(({ id, name }) => ({
              label: name,
              value: id,
            }))}
            value={employeeId}
            onChange={(value) => handleChange(index, "employeeId", value)}
          />
          <TimeInput
            label="Start"
            required
            value={start?.toDate()}
            onChange={(value) =>
              handleChange(
                index,
                "start",
                Timestamp.fromDate(
                  dayjs(dateData.date).hour(value.getHours()).toDate()
                )
              )
            }
          />
          <TimeInput
            label="End"
            required
            value={end?.toDate()}
            onChange={(value) =>
              handleChange(
                index,
                "end",
                Timestamp.fromDate(
                  dayjs(dateData.date).hour(value.getHours()).toDate()
                )
              )
            }
          />
          <ActionIcon onClick={() => deleteAvailability(index)}>
            <HiMinus />
          </ActionIcon>
        </Group>
      ))}

      <Button onClick={handleSubmit}>Save Changes</Button>
    </Group>
  );
}
