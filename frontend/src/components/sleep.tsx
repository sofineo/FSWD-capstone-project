import api from "@/services/api";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { SkeletonCard } from "./ui/skeleton-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { SleepForm } from "./sleep-form";
import type { Sleep } from "@/lib/types/sleep";
import { UpdateSleepForm } from "./update-sleep-form";

interface SleepProps {
  selectedDate: Date;
  user: string | null;
}

export function Sleep({ selectedDate, user }: SleepProps) {
  const [data, setData] = useState<Sleep[] | null>(null);
  const [loading, setLoading] = useState(true);
  const formatDate = format(selectedDate, "yyyy-MM-dd");
  const [refresh, setRefresh] = useState(false);

  async function retchSleep() {
    setRefresh((prev) => !prev);
  }

  async function handleDeleteButton(sleep_id: string) {
    api
      .delete(`/api/sleep/${sleep_id}`)
      .then(() => {
        toast("Sleep record deleted successfully!");
        retchSleep();
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response.data.message);
        } else {
          toast(
            "We were unable to delete your sleep record. Please try again later."
          );
        }
      });
  }

  useEffect(() => {
    async function fetchSleep() {
      setLoading(true);
      const res = await api.get(`/api/sleep?date=${formatDate}`);
      setData(res.data?.length ? res.data : null);

      setLoading(false);
    }
    fetchSleep();
  }, [selectedDate, refresh]);

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <div>
      {data ? (
        data.map((sleep) => (
          <div className="ps-1" key={sleep.sleep_id}>
            <div className="text-sm">
              <p>
                Duration: {sleep.sleep_hours ? `${sleep.sleep_hours} hr` : "-"}{" "}
              </p>
              <p>Goal: {sleep.sleep_goal ? `${sleep.sleep_goal} hr` : "-"}</p>
            </div>
            <div className="mt-2 flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline2" size={"icon"}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align={"start"}>
                  <UpdateSleepForm
                    user={user}
                    data={sleep}
                    retchSleep={retchSleep}
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant={"outline2"}
                size={"icon"}
                onClick={() => {
                  handleDeleteButton(sleep.sleep_id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <SleepForm
          user={user}
          selectedDate={formatDate}
          retchSleep={retchSleep}
        />
      )}
    </div>
  );
}
