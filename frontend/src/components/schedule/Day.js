import { useEffect, useState } from "react";
import DayHoursForm from "./popovers/DayHours";
import axios from "axios";
import {
  useMantineTheme,
  Text,
  Group,
  Box,
  Popover,
  ActionIcon,
  LoadingOverlay,
} from "@mantine/core";
import dayjs from "dayjs";
import { HiPencil, HiPlus, HiUserAdd } from "react-icons/hi";
import EmployeeAvailability from "./popovers/EmployeeAvailability";

export default function Day({ day }) {
  const [dayPopoverOpened, setDayPopoverOpened] = useState(false);
  const [employeePopoverOpened, setEmployeePopoverOpened] = useState(false);
  const [loading, setLoading] = useState(true);

  const [dateData, setDateData] = useState({
    date: dayjs(day).format(),
  });
  const theme = useMantineTheme();

  useEffect(() => {
    const controller = new AbortController();
    async function getDateData() {
      try {
        const response = await axios.get(`/api/dates/${dateData.date}`, {
          signal: controller.signal,
        });
        if (response.data.result) setDateData(response.data.result);
        setLoading(false);
      } catch (error) {
        if (error.message !== "canceled") console.log(error);
      }
    }
    getDateData();
    return () => controller.abort();
  }, [day]);

  async function handleDayHoursSubmit({ opens, closes, min_emps_working }) {
    const data = {
      opens: dayjs(opens).hour(),
      closes: dayjs(closes).hour(),
      min_emps_working,
    };

    // The day will have an _id if it already exists in the db
    // Send a put request instead of a post request in that case
    const mode = dateData?._id ? "edit_day" : "create_day";
    mode === "create_day"
      ? (data.date = dateData.date)
      : (data._id = dateData._id);

    try {
      const response =
        mode === "edit_day"
          ? await axios.put(`/api/dates/${dateData._id}`, data)
          : await axios.post("/api/dates", data);

      if (mode === "create_day") data._id = response.data.result.insertedId;
      setDateData(data); // Change internal state so date can be edited without refreshing
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEmployeeAvailabilitySubmit(values) {
    try {
      const response = await axios.put(`/api/dates/${dateData._id}`, {
        availability: values,
      });

      console.log(response);
      // setDateData(data); // Change internal state so date can be edited without refreshing
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Box
      sx={{
        borderTop: "3px solid" + theme.colors.gray[6],
        position: "relative",
      }}
    >
      <LoadingOverlay visible={loading} />
      <Group position="apart">
        <Text>{day.getDate()}</Text>
        {dayjs(day).isAfter(dayjs()) && (
          <Group spacing={0}>
            <Popover
              opened={dayPopoverOpened}
              onClose={() => setDayPopoverOpened(false)}
              title="Edit date"
              withCloseButton
              target={
                <ActionIcon
                  onClick={() => setDayPopoverOpened(!dayPopoverOpened)}
                >
                  {dateData?._id ? <HiPencil /> : <HiPlus />}
                </ActionIcon>
              }
            >
              <DayHoursForm
                dateData={dateData}
                handleSubmit={handleDayHoursSubmit}
              />
            </Popover>

            {dateData?._id && (
              <Popover
                opened={employeePopoverOpened}
                onClose={() => setEmployeePopoverOpened(false)}
                title="Edit date"
                withCloseButton
                target={
                  <ActionIcon
                    onClick={() =>
                      setEmployeePopoverOpened(!employeePopoverOpened)
                    }
                  >
                    <HiUserAdd />
                  </ActionIcon>
                }
              >
                <EmployeeAvailability
                  dateData={dateData}
                  handleSubmit={handleEmployeeAvailabilitySubmit}
                />
              </Popover>
            )}
          </Group>
        )}
      </Group>
    </Box>
  );
}
