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
import { useAuth } from "@/context/AuthContext";

// This is sample data.
const data1 = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  calendars: [
    {
      name: "My Calendars",
      items: ["Personal", "Work", "Family"],
    },
    {
      name: "Favorites",
      items: ["Holidays", "Birthdays"],
    },
    {
      name: "Other",
      items: ["Travel", "Reminders", "Deadlines"],
    },
  ],
};

interface User {
  user_id: string;
  name: string;
  email: string;
  // avatar: string
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const [data, setData] = useState<User | null>(null);
  const [refresh, setRefresh] = useState(false);

  async function refetchUser() {
    setRefresh((prev) => !prev);
  }

  useEffect(() => {
    async function fetchUser() {
      const res = await api.get(`/api/users/${user}`);
      setData(res.data);
    }
    fetchUser();
  }, [refresh]);

  return (
    <Sidebar {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <NavUser user={data} refetchUser={refetchUser} />
      </SidebarHeader>
      <SidebarContent>
        <DatePicker />
        <SidebarSeparator className="mx-0" />
        <Calendars calendars={data1.calendars} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Plus />
              <span>New Calendar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
