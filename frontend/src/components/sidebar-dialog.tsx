import * as React from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";

interface SidebarDialogProps {
  title: string;
  description: string;
  buttonText: string;
  dialogKey: string;
  openDialog: string | null;
  setOpenDialog: (key: string | null) => void;
  FormComponent?: React.ComponentType<any>;
  formProps?: Record<string, any>;
}

export function SidebarDialog({
  title,
  description,
  buttonText,
  dialogKey,
  openDialog,
  setOpenDialog,
  FormComponent,
  formProps = {}
}: SidebarDialogProps) {
  return (
    <Dialog
      open={openDialog === dialogKey}
      onOpenChange={(isOpen) => setOpenDialog(isOpen ? dialogKey : null)}
    >
      <DialogTrigger asChild>
        <SidebarMenuButton>
          <Plus />
          <span>{buttonText}</span>
        </SidebarMenuButton>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {FormComponent && <FormComponent {...formProps} />}
      </DialogContent>
    </Dialog>
  );
}
