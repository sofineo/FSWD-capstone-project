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
import { Pencil, Trash2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { WaterIntake } from "@/lib/types/water-intake";
import { WaterForm } from "./water-form";
import { UpdateWaterIntakeForm } from "./update-water-form";
import { useImperialSystem } from "@/context/imperialSystemContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { ChartConfig, ChartContainer } from "./ui/chart";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";
import { mlToOz } from "@/utils/conversion";

interface WaterProps {
  selectedDate: Date;
  user: string | null;
}

export function Water({ selectedDate, user, ...props }: WaterProps) {
  const { imperialSystem } = useImperialSystem();
  const [data, setData] = useState<WaterIntake | null>(null);
  const [loading, setLoading] = useState(true);
  const formatDate = format(selectedDate, "yyyy-MM-dd");
  const [refresh, setRefresh] = useState(false);
  const [water, setWater] = useState<number | null>(null);

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
    async function fetchWater() {
      setLoading(true);
      const res = await api.get(`/api/water-intake?date=${formatDate}`);
      setData(res.data.result ? res.data.result : null);

      setLoading(false);
    }
    fetchWater();
  }, [selectedDate, refresh]);

  useEffect(() => {
    if (imperialSystem && data) {
      setWater(mlToOz(data.water_consumed_ml));
    } else if (data) {
      setWater(data.water_consumed_ml);
    } else {
      setWater(0);
    }
  }, [data]);

  const chartData = [
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  ];
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    safari: {
      label: "Safari",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  if (loading) {
    return <SkeletonCard />;
  }

  return (
    <div>
      {data ? (
        // data.map((water) => (
        <div className="ps-1" key={data.water_intake_id}>
          <div className="text-sm">
            <p>
              Consumption: {` ${water} `}
              {imperialSystem ? `oz` : "ml"}
            </p>

            <p>Goal: {data.water_goal_ml ? `${data.water_goal_ml} ml` : "-"}</p>
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
                  data={data}
                  refetchWaterIntake={refetchWaterIntake}
                />
              </PopoverContent>
            </Popover>
            <Button
              variant={"outline2"}
              size={"icon"}
              onClick={() => {
                handleDeleteButton(data.water_intake_id);
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
          <div>
            <Card className="flex flex-col">
              <CardHeader className="items-center pb-0">
                <CardTitle>Radial Chart - Text</CardTitle>
                <CardDescription>January - June 2024</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 pb-0">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px]"
                >
                  <RadialBarChart
                    data={chartData}
                    startAngle={0}
                    endAngle={250}
                    innerRadius={80}
                    outerRadius={110}
                  >
                    <PolarGrid
                      gridType="circle"
                      radialLines={false}
                      stroke="none"
                      className="first:fill-muted last:fill-background"
                      polarRadius={[86, 74]}
                    />
                    <RadialBar
                      dataKey="visitors"
                      background
                      cornerRadius={10}
                    />
                    <PolarRadiusAxis
                      tick={false}
                      tickLine={false}
                      axisLine={false}
                    >
                      <Label
                        content={({ viewBox }) => {
                          if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                            return (
                              <text
                                x={viewBox.cx}
                                y={viewBox.cy}
                                textAnchor="middle"
                                dominantBaseline="middle"
                              >
                                <tspan
                                  x={viewBox.cx}
                                  y={viewBox.cy}
                                  className="fill-foreground text-4xl font-bold"
                                >
                                  {chartData[0].visitors.toLocaleString()}
                                </tspan>
                                <tspan
                                  x={viewBox.cx}
                                  y={(viewBox.cy || 0) + 24}
                                  className="fill-muted-foreground"
                                >
                                  Visitors
                                </tspan>
                              </text>
                            );
                          }
                        }}
                      />
                    </PolarRadiusAxis>
                  </RadialBarChart>
                </ChartContainer>
              </CardContent>
              <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 font-medium leading-none">
                  Trending up by 5.2% this month{" "}
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                  Showing total visitors for the last 6 months
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      ) : (
        // ))
        <WaterForm
          user={user}
          selectedDate={formatDate}
          refetchWaterIntake={refetchWaterIntake}
        />
      )}
    </div>
  );
}
