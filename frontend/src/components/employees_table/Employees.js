import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Group, Modal, Table, Title } from "@mantine/core";
import EmployeeForm from "./EmployeeForm";
import {
  addDoc,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db, employeesRef } from "../..";

export default function EmployeesSection() {
  const [employees, setEmployees] = useState([]);
  const [employeeEditing, setEmployeeEditing] = useState(null);
  const [modalVisibility, setModalVisibility] = useState(false);

  useEffect(() => {
    const employeeUnsub = onSnapshot(employeesRef, (snapshot) => {
      setEmployees(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return () => employeeUnsub();
  }, []);

  async function handleSubmit(values) {
    try {
      if (!values.id) {
        addDoc(employeesRef, values);
        console.log("Added employee");
      } else {
        const docRef = doc(db, "employees", values.id);
        const { id, ...updatedValues } = values;
        updateDoc(docRef, updatedValues);
        console.log("Updated employee");
      }
    } catch (error) {
      console.log(error);
    }
    setModalVisibility(false);
  }

  function toggleModal(employee) {
    if (employee) {
      setEmployeeEditing(employee);
    } else {
      setEmployeeEditing(null);
    }
    setModalVisibility(!modalVisibility);
  }

  async function deleteEmployee({ id }) {
    try {
      const docRef = doc(db, "employees", id);
      deleteDoc(docRef);
      console.log("Deleted employee");
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
