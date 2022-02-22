import { useState } from "react";
import Day from "./Day";
import {
  ActionIcon,
  Text,
  Group,
  SimpleGrid,
  Title,
  useMantineTheme,
  LoadingOverlay,
} from "@mantine/core";
import {
  HiOutlineChevronDoubleLeft,
  HiOutlineChevronDoubleRight,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
} from "react-icons/hi";
import { getMonthDays, getWeekdaysNames } from "@mantine/dates";
import dayjs from "dayjs";

export default function ScheduleSection() {
  const [month, setMonth] = useState(dayjs());
  const theme = useMantineTheme();

  function changeDate(increment, interval) {
    setMonth(month.add(increment, interval));
  }

  return (
    <>
      <Title order={1} align="center">
        Schedule
      </Title>
      <Group position="center">
        <ActionIcon
          onClick={() => changeDate(-1, "year")}
          size="lg"
          radius="lg"
        >
          <HiOutlineChevronDoubleLeft size={theme.spacing.lg} />
        </ActionIcon>
        <ActionIcon
          onClick={() => changeDate(-1, "month")}
          size="lg"
          radius="lg"
        >
          <HiOutlineChevronLeft size={theme.spacing.lg} />
        </ActionIcon>
        <Text>{month.format("MMMM, YYYY")}</Text>
        <ActionIcon
          onClick={() => changeDate(1, "month")}
          size="lg"
          radius="lg"
        >
          <HiOutlineChevronRight size={theme.spacing.lg} />
        </ActionIcon>
        <ActionIcon onClick={() => changeDate(1, "year")} size="lg" radius="lg">
          <HiOutlineChevronDoubleRight size={theme.spacing.lg} />
        </ActionIcon>
      </Group>

      <SimpleGrid cols={7}>
        {getWeekdaysNames("en", "sunday").map((weekday) => (
          <Text>{weekday}</Text>
        ))}
        {getMonthDays(month.toDate(), "sunday").map((week) =>
          week.map((day) => <Day day={day} />)
        )}
      </SimpleGrid>
    </>
  );
}

// function Day(props) {
//   const [dateData, setDateData] = useState(null);
//   const [formVisibility, setFormVisibility] = useState(false);
//   const [isLoading, setLoading] = useState(true);

//   useEffect(() => {
//     const controller = new AbortController();
//     async function getDateData() {
//       try {
//         const response = await axios.get(`/api/dates/${props.day.format()}`, {
//           signal: controller.signal,
//         });
//         setDateData(response.data.result);
//         setLoading(false);
//         // message.success({'content': response.data.message, key: 'date_data'})
//       } catch (error) {
//         const errorMessage = error.message || error.response?.data.message;
//         if (errorMessage !== "canceled") {
//           // If user didn't intentionally switch months (cancelling fetch)
//           console.log(error?.response?.data?.err || error);
//           message.error({ content: errorMessage, key: "date_data" });
//         }
//       }
//     }
//     getDateData();
//     return () => controller.abort();
//   }, [props]);

//   return (
//     <Col
//       style={{
//         borderTop: "solid 2px lightgrey",
//         margin: "8px 4px",
//         width: "13%",
//         minHeight: "3rem",
//       }}
//     >
//       <Spin spinning={isLoading}>
//         <Row justify="space-between">
//           <Col>{props.day.format("D")}</Col>
//           <Col>
//             {props.day.isAfter(dayjs()) && (
//               <SelectedDateContext.Provider value={dateData}>
//                 <Popover
//                   visible={formVisibility}
//                   onVisibleChange={() => setFormVisibility(!formVisibility)}
//                   placement="topLeft"
//                   content={
//                     <DateEditPopover
//                       setFormVisibility={setFormVisibility}
//                       dateData={dateData}
//                       setDateData={setDateData}
//                       day={props.day}
//                     />
//                   }
//                   trigger="click"
//                 >
//                   <Tooltip title={dateData ? "Edit hours" : "Add hours"}>
//                     <Button
//                       size="small"
//                       type="dashed"
//                       shape="circle"
//                       icon={dateData ? <EditOutlined /> : <PlusOutlined />}
//                     ></Button>
//                   </Tooltip>
//                 </Popover>
//               </SelectedDateContext.Provider>
//             )}
//           </Col>
//         </Row>
//         {props.day.isAfter(dayjs()) && (
//           <Row>
//             <Col>
//               <Badge status="success" text="Employees" />
//             </Col>
//           </Row>
//         )}
//       </Spin>
//     </Col>
//   );
// }

// function EmployeesForm() {
//   function onSubmit() {}

//   return (
//     <Form onFinish={onSubmit}>
//       <Form.List name="employees">
//         {(fields, { add, remove }) => {
//           return (
//             <>
//               {fields.map(({ key, name }) => {
//                 return (
//                   <Space key={key} align="baseline">
//                     <Form.Item name="" rules={[{ required: true }]}>
//                       <Input placeholder="First Name" />
//                     </Form.Item>
//                     <Form.Item rules={[{ required: true }]} name="start_end">
//                       <TimePicker.RangePicker placeholder={["Start", "End"]} />
//                     </Form.Item>
//                     <MinusCircleOutlined onClick={() => remove(name)} />
//                   </Space>
//                 );
//               })}
//               <Form.Item>
//                 <Button
//                   type="dashed"
//                   onClick={() => add()}
//                   block
//                   icon={<PlusOutlined />}
//                 >
//                   Add Availability
//                 </Button>
//               </Form.Item>
//             </>
//           );
//         }}
//       </Form.List>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           Submit
//         </Button>
//       </Form.Item>
//     </Form>
//   );
// }
