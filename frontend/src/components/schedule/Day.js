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
import {
  doc,
  addDoc,
  getDocs,
  onSnapshot,
  query,
  where,
  updateDoc,
  getDoc,
  Timestamp,
  setDoc,
} from "firebase/firestore";
import { datesRef, db } from "../..";

export default function Day({ day }) {
  const [dayPopoverOpened, setDayPopoverOpened] = useState(false);
  const [employeePopoverOpened, setEmployeePopoverOpened] = useState(false);
  const [loading, setLoading] = useState();

  const [dateData, setDateData] = useState({});
  const theme = useMantineTheme();

  useEffect(() => {
    setDateData({ date: day });
    async function getDateData() {
      const docRef = doc(db, "dates", dayjs(day).format("YYYY-MM-DD"));
      const result = await getDoc(docRef);
      setDateData({ date: day, ...result.data() });
    }

    getDateData();
  }, [day]);

  async function handleDayHoursSubmit(data) {
    data = {
      opens: Timestamp.fromDate(
        dayjs(dateData.date).hour(data.opens.getHours()).toDate()
      ),
      closes: Timestamp.fromDate(
        dayjs(dateData.date).hour(data.closes.getHours()).toDate()
      ),
    };

    // Update date if already existing, else create a new one
    try {
      const docRef = doc(
        db,
        "dates",
        dayjs(dateData.date).format("YYYY-MM-DD")
      );
      setDoc(docRef, data);
      setDateData({ ...dateData, opens: data.opens, closes: data.closes });
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

        <Group spacing={0}>
          <Popover
            opened={dayPopoverOpened}
            onClose={() => setDayPopoverOpened(false)}
            title={`Edit ${dayjs(day).format("D/M/YYYY")} Hours`}
            withCloseButton
            target={
              <ActionIcon
                onClick={() => setDayPopoverOpened(!dayPopoverOpened)}
              >
                {dateData.opens ? <HiPencil /> : <HiPlus />}
              </ActionIcon>
            }
          >
            <DayHoursForm
              dateData={dateData}
              handleSubmit={handleDayHoursSubmit}
            />
          </Popover>

          {dateData.opens && (
            <Popover
              opened={employeePopoverOpened}
              onClose={() => setEmployeePopoverOpened(false)}
              title="Edit employee availability"
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
              <EmployeeAvailability dateData={dateData} />
            </Popover>
          )}
        </Group>
      </Group>
    </Box>
  );
}
