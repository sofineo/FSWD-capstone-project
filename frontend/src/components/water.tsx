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
import { WaterIntake } from "@/lib/types/water-intake";
import { WaterForm } from "./water-form";
import { UpdateWaterIntakeForm } from "./update-water-form";

interface SleepProps {
  selectedDate: Date;
  user: string | null;
}

export function Water({ selectedDate, user, ...props }: SleepProps) {
  const [data, setData] = useState<WaterIntake[] | null>(null);
  const [loading, setLoading] = useState(true);
  const formatDate = format(selectedDate, "yyyy-MM-dd");
  const [refresh, setRefresh] = useState(false);

  async function refetchWaterIntake() {
    setRefresh((prev) => !prev);
  }

  async function handleDeleteButton(water_intake_id: string) {
    api
      .delete(`/api/water-intake/${water_intake_id}`)
      .then(() => {
        toast("Water intake record deleted successfully!");
        refetchWaterIntake();
      })
      .catch((error) => {
        if (error.response) {
          toast(error.response.data.message);
        } else {
          toast(
            "We were unable to delete your water intake record. Please try again later."
          );
        }
      });
  }

  useEffect(() => {
    async function fetchSleep() {
      setLoading(true);
      const res = await api.get(`/api/water-intake?date=${formatDate}`);
      setData(res.data.result?.length ? res.data.result : null);

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
        data.map((water) => (
          <div className="ps-1" key={water.water_intake_id}>
            <div className="text-sm">
              <p>
                Consumption:{" "}
                {water.water_consumed_ml
                  ? `${water.water_consumed_ml} ml`
                  : "-"}
              </p>
              <p>
                Goal: {water.water_goal_ml ? `${water.water_goal_ml} ml` : "-"}
              </p>
            </div>
            <div className="mt-2 flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline2" size={"icon"}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align={"start"}>
                  <UpdateWaterIntakeForm
                    user={user}
                    data={water}
                    refetchWaterIntake={refetchWaterIntake}
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant={"outline2"}
                size={"icon"}
                onClick={() => {
                  handleDeleteButton(water.water_intake_id);
                }}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))
      ) : (
        <WaterForm
          user={user}
          selectedDate={formatDate}
          refetchWaterIntake={refetchWaterIntake}
        />
      )}
    </div>
  );
}
