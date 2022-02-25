import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Group, Modal, Table, Title } from "@mantine/core";
import EmployeeForm from "./EmployeeForm";

export default function EmployeesSection() {
  const [employees, setEmployees] = useState([]);
  const [employeeEditing, setEmployeeEditing] = useState(null);
  const [modalVisibility, setModalVisibility] = useState(false);

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

  async function handleSubmit(values) {
    try {
      const response = employeeEditing
        ? await axios.put(`/api/employees/${employeeEditing._id}`, values)
        : await axios.post("/api/employees", values);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  function toggleModal(employee) {
    if (employee) {
      setEmployeeEditing(employee);
    } else {
      setEmployeeEditing(null);
    }
    setModalVisibility(!modalVisibility);
  }

  async function deleteEmployee({ _id }) {
    try {
      const response = await axios.delete(`/api/employees/${_id}`);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section>
      <Title order={1} align="center">
        Employees
      </Title>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Role</th>
            <th>Colour</th>
            <th>Job Type</th>
            <th>Operation</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee, index) => (
            <tr key={index}>
              <td>{employee.name}</td>
              <td>{employee.role}</td>
              <td>{employee.colour}</td>
              <td>{employee.full_time ? "Full Time" : "Part Time"}</td>
              <td>
                <Group>
                  <Button onClick={() => toggleModal(employee)}>Edit</Button>
                  <Button onClick={() => deleteEmployee(employee)}>
                    Delete
                  </Button>
                </Group>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Button onClick={() => toggleModal()}>Add New Employee</Button>
      <Modal
        title="Edit employees"
        opened={modalVisibility}
        onClose={() => toggleModal()}
      >
        <EmployeeForm
          handleSubmit={handleSubmit}
          employeeData={employeeEditing}
        />
      </Modal>
    </section>
  );
}
