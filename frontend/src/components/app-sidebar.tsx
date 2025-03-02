import * as React from "react";
import { Plus } from "lucide-react";

import { Calendars } from "@/components/calendars";
import { DatePicker } from "@/components/date-picker";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import api from "@/services/api";
import { User } from "@/lib/types/user";
import { WorkoutForm } from "./workout-form";
import { SidebarDialog } from "./sidebar-dialog";

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
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <NavUser user={data} refetchUser={refetchUser} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker onDateChange={setSelectedDate} />
        <SidebarSeparator className="mx-0" />
        {/* <Calendars calendars={data1.calendars} /> */}
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
            <SidebarMenuButton>
              <Plus />
              <span>Log Sleep</span>
            </SidebarMenuButton>
            <SidebarMenuButton>
              <Plus />
              <span>Log Water Intake</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
