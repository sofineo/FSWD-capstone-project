import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/context/AuthContext";
import { Workout } from "@/components/workout";

export function Dashboard() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { user } = useAuth();

  return (
    <SidebarProvider>
      <AppSidebar user={user} setSelectedDate={setSelectedDate} />
      <SidebarInset>
        <header className="bg-white sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4 dark:bg-slate-950">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {format(selectedDate, "eeee - MMM dd, yyyy")}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Tabs defaultValue="workout" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="workout">Workout</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
              <TabsTrigger value="water">Water</TabsTrigger>
            </TabsList>
            <TabsContent value="goals">
              Make changes to your goals here.
            </TabsContent>
            <TabsContent value="workout">
              <Workout selectedDate={selectedDate} />
            </TabsContent>
            <TabsContent value="sleep">
              Make changes your sleep here.
            </TabsContent>
            <TabsContent value="water">
              Make changes your water here
            </TabsContent>
          </Tabs>
          <div className="grid auto-rows-min gap-4 md:grid-cols-5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="bg-slate-100/50 aspect-square rounded-xl dark:bg-slate-800/50"
              />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
