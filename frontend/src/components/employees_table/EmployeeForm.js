import {
  Button,
  Checkbox,
  Group,
  Modal,
  Select,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { useForm } from "@mantine/hooks";

export default function EmployeeForm({ employeeData, handleSubmit }) {
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: employeeData ?? {},
  });

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Group direction="column">
        <TextInput
          label="Full Name"
          placeholder="Full Name"
          {...form.getInputProps("name")}
        />
        <TextInput
          label="Role"
          placeholder="Sales Associate, Tech Lead..."
          {...form.getInputProps("role")}
        />
        <Checkbox
          label="Full Time"
          {...form.getInputProps("full_time", { type: "checkbox" })}
        />
        <Select
          label="Colour"
          placeholder="Colour"
          {...form.getInputProps("colour")}
          data={Object.keys(theme.colors).map((colour) => ({
            label: colour,
            value: colour,
          }))}
        />
        <Button type="submit">Submit</Button>
      </Group>
    </form>
  );
}
