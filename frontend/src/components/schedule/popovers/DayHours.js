import { useForm } from "@mantine/hooks";
import { HiOutlineClock } from "react-icons/hi";
import { TimeInput } from "@mantine/dates";
import { Button, Group } from "@mantine/core";

export default function DayHoursForm({ dateData, handleSubmit }) {
  const form = useForm({
    initialValues: {
      opens: dateData.opens?.toDate(),
      closes: dateData.closes?.toDate(),
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
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}
