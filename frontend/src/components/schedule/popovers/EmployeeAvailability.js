import { Group, Button, Text, Title, Divider } from "@mantine/core";
import {
  DateRangePicker,
  getWeekdaysNames,
  TimeRangeInput,
} from "@mantine/dates";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useEffect, useState } from "react";
import {
  addDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { availabilitiesRef, db } from "../../..";
import { useForm } from "@mantine/hooks";

dayjs.extend(localizedFormat);
// This document will be hell to fix, may the odds be ever in your favour

export default function EmployeeAvailability({ employeeData }) {
  const [employeeAvailability, setEmployeeAvailability] = useState([]);
  const [availabilityEditing, setAvailabilityEditing] = useState(null);
  const initialValues = {
    ...availabilityEditing?.weekAvailability.map((times) =>
      Object.values(times).map((time) => time.toDate())
    ),
  };

  function validateTime(times) {
    if (times.some((time) => time === null))
      return dayjs(times[0]).isBefore(times[1]);
    return false;
  }

  const form = useForm({
    initialValues: {
      dateRange: null,
      0: null,
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null,
    },
    validationRules: {
      dateRange: (value) => validateTime(value),
      0: (value) => validateTime(value),
      1: (value) => validateTime(value),
      2: (value) => validateTime(value),
      3: (value) => validateTime(value),
      4: (value) => validateTime(value),
      5: (value) => validateTime(value),
      6: (value) => validateTime(value),
    },
    errorMessages: {
      dateRange: "Date is required and must be in order",
      0: "Time is required and must be in order",
      1: "Time is required and must be in order",
      2: "Time is required and must be in order",
      3: "Time is required and must be in order",
      4: "Time is required and must be in order",
      5: "Time is required and must be in order",
      6: "Time is required and must be in order",
    },
  });

  useEffect(() => {
    // Get initial availabilities for employees
    // Used for populating list of employee availability for each day
    async function getAvailablities() {
      try {
        const queryRef = query(
          availabilitiesRef,
          where("employeeId", "==", employeeData.id)
        );
        const result = await getDocs(queryRef);

        setEmployeeAvailability(
          result.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        );
      } catch (error) {
        console.log(error);
      }
    }

    getAvailablities();
  }, []);

  useEffect(() => {
    if (availabilityEditing) form.setValues(initialValues);
  }, [availabilityEditing]);

  function handleSubmit({ dateRange, ...timeRanges }) {
    try {
      // Check if date needs to be updated or added to availabilities
      let data = {
        weekAvailability: Object.values(timeRanges).map((times) => ({
          start: times[0],
          end: times[1],
        })),
      };

      if (availabilityEditing) {
        const docRef = doc(db, `availability/${availabilityEditing.id}`);
        // updateDoc(docRef, data);
      } else {
        data = {
          ...data,
          employeeId: employeeData.id,
          startDate: dateRange[0],
          endDate: dateRange[1],
        };
        // addDoc(availabilitiesRef, data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <>
      <Group direction="column">
        <Title order={3}>Set availabilities</Title>
        {employeeAvailability.map((availability, index) => (
          <Group>
            <Text key={index}>
              {dayjs(availability.startDate.toDate()).format("LL")} -{" "}
              {dayjs(availability.endDate.toDate()).format("LL")}
            </Text>
            <Button onClick={() => setAvailabilityEditing(availability)}>
              Edit
            </Button>
          </Group>
        ))}
      </Group>

      <Divider my="xl" />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Group direction="column" position="center">
          <Title order={3}>New Availability</Title>
          <DateRangePicker
            required
            disabled={availabilityEditing}
            label="Date Range"
            placeholder="Pick a Date Range"
            minDate={
              dayjs(employeeAvailability[0]?.endDate.toDate())
                .add(1, "day")
                .toDate() || new Date()
            }
            {...form.getInputProps("dateRange")}
          />
          {getWeekdaysNames("en", "sunday").map((weekday, index) => (
            <div key={index}>
              <TimeRangeInput
                label={weekday}
                required
                {...form.getInputProps(index)}
              />
            </div>
          ))}
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </>
  );
}
