import { Title, Header, AppShell, MantineProvider } from "@mantine/core";
import ScheduleSection from "./schedule/Schedule";

function App() {
  return (
    <MantineProvider
      theme={{ colorScheme: "dark" }}
      withGlobalStyles
      withNormalizeCSS
    >
      <AppShell
        header={
          <Header padding="lg">
            <Title order={3} align="center">
              React Scheduling System
            </Title>
          </Header>
        }
      >
        <ScheduleSection />
      </AppShell>
    </MantineProvider>
  );
}

export default App;
