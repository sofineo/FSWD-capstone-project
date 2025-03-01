import { Calendar } from "@/components/ui/calendar";
import { SidebarGroup, SidebarGroupContent } from "@/components/ui/sidebar";
import { useState } from "react";

interface DatePickerProps {
  onDateChange: (date: Date) => void;
}

export function DatePicker({ onDateChange }: DatePickerProps) {
  const [date, setDate] = useState<Date>();

  const handleDateChange = (selectedDate: Date) => {
    setDate(selectedDate);
    onDateChange(selectedDate);
  };

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]"
          selected={date}
          onDayClick={handleDateChange}
          initialFocus
        />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
