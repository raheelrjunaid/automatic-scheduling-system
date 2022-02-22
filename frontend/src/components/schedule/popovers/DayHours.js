import { useForm } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { HiOutlineClock, HiPlus, HiUserAdd } from "react-icons/hi";
import { TimeInput } from "@mantine/dates";
import { Button, Group, NumberInput, Space } from "@mantine/core";
import dayjs from "dayjs";

export default function DayHoursForm({ dateData, handleSubmit }) {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(dateData);
  }, [dateData]);

  const form = useForm({
    initialValues: {
      opens: dayjs(dateData.date).hour(dateData.opens).toDate?.(),
      closes: dayjs(dateData.date).hour(dateData.closes).toDate?.(),
      min_emps_working: dateData?.min_emps_working,
    },
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group spacing="md" direction="column">
        <Group>
          <TimeInput
            label="Opening Time"
            required
            icon={<HiOutlineClock />}
            {...form.getInputProps("opens")}
          />
          <TimeInput
            label="Closing Time"
            required
            icon={<HiOutlineClock />}
            {...form.getInputProps("closes")}
          />
        </Group>

        <NumberInput
          label="Minimum Employees Working"
          min={0}
          required
          {...form.getInputProps("min_emps_working")}
        />
        <Button type="submit" loading={loading}>
          Submit
        </Button>
      </Group>
    </form>
  );
}
