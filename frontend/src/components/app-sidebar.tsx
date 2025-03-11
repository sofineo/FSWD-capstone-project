import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { User } from "@/lib/types/user";
import { WorkoutForm } from "./workout-form";
import { SidebarDialog } from "./sidebar-dialog";
import { SleepForm } from "./sleep-form";
import { WaterForm } from "./water-form";

interface AppSidebarProps {
  user: string | null;
  setSelectedDate: (date: Date) => void;
}

export function AppSidebar({
  user,
  setSelectedDate,
  ...props
}: AppSidebarProps) {
  const [data, setData] = useState<User | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [openDialog, setOpenDialog] = useState<string | null>(null);

  async function refetchUser() {
    setRefresh((prev) => !prev);
  }

  useEffect(() => {
    async function fetchUser() {
      const res = await api.get(`/api/users/${user}`);
      setData(res.data);
    }
    fetchUser();
  }, [user, refresh]);

  return (
    <Sidebar {...props}>
      <h1 className="text-2xl pt-2 px-4 text-slate-400">HeathySync</h1>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <NavUser user={data} refetchUser={refetchUser} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker onDateChange={setSelectedDate} />
        <SidebarSeparator className="mx-0" />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarDialog
              title="Log Workout"
              description="Add details about your workout session."
              buttonText="Log Workout"
              dialogKey="workout"
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              FormComponent={WorkoutForm}
              formProps={{ user }}
            />
            <SidebarDialog
              title="Log Sleep Record"
              description="Add details about your sleep record."
              buttonText="Log Sleep Record"
              dialogKey="sleep"
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              FormComponent={SleepForm}
              formProps={{ user }}
            />
            <SidebarDialog
              title="Log Water Intake Record"
              description="Add details about your water intake record."
              buttonText="Log Water Intake Record"
              dialogKey="water"
              openDialog={openDialog}
              setOpenDialog={setOpenDialog}
              FormComponent={WaterForm}
              formProps={{ user }}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
