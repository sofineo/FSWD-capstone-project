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

export function Dashboard() {
  return (
    <SidebarProvider>
      <AppSidebar />
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
                <BreadcrumbPage>October 2024</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Tabs defaultValue="workout" className="w-[400px]">
            <TabsList>
              <TabsTrigger value="workout">Workout</TabsTrigger>
              <TabsTrigger value="sleep">Sleep</TabsTrigger>
              <TabsTrigger value="Water">Water</TabsTrigger>
            </TabsList>
            <TabsContent value="workout">
              Make changes to your Workout here.
            </TabsContent>
            <TabsContent value="sleep">
              Change your sleep here.
            </TabsContent>
            <TabsContent value="water">
              Change your water here.
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
