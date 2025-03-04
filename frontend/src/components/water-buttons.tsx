import { Button } from "@/components/ui/button";
import { GlassWater, Droplet, Droplets } from "lucide-react";

export function WaterButtons({
  addWater,
  imperialSystem,
}: {
  addWater: (amount: number) => void;
  imperialSystem: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 flex-wrap w-7/8">
      {/* Small Water Glass - 250ml / 8oz */}
      <Button
        type="button"
        variant="outline"
        size={"sm"}
        onClick={() => addWater(250)}
        className={imperialSystem ? "hidden" : "flex"}
      >
        <GlassWater className="w-5 h-5 mr-2 text-blue-500" />
        +250 ml
      </Button>
      <Button
        type="button"
        variant="outline"
        size={"sm"}
        onClick={() => addWater(8)}
        className={imperialSystem ? "flex" : "hidden"}
      >
        <GlassWater className="w-5 h-5 mr-2 text-blue-600" />
        +8 oz
      </Button>

      {/* Medium Water - 500ml / 16oz */}
      <Button
        type="button"
        variant="outline"
        size={"sm"}
        onClick={() => addWater(500)}
        className={imperialSystem ? "hidden" : "flex"}
      >
        <Droplet className="w-5 h-5 mr-2 text-blue-500" />
        +500 ml
      </Button>
      <Button
        type="button"
        variant="outline"
        size={"sm"}
        onClick={() => addWater(16)}
        className={imperialSystem ? "flex" : "hidden"}
      >
        <Droplet className="w-5 h-5 mr-2 text-blue-600" />
        +16 oz
      </Button>

      {/* Large Water - 750ml / 24oz */}
      <Button
        type="button"
        variant="outline"
        size={"sm"}
        onClick={() => addWater(750)}
        className={imperialSystem ? "hidden" : "flex"}
      >
        <Droplets className="w-5 h-5 mr-2 text-blue-500" />
        +750 ml
      </Button>
      <Button
        type="button"
        variant="outline"
        size={"sm"}
        onClick={() => addWater(24)}
        className={imperialSystem ? "flex" : "hidden"}
      >
        <Droplets className="w-5 h-5 mr-2 text-blue-600" />
        +24 oz
      </Button>

      {/* Full Bottle - 1L */}
      <Button
        type="button"
        variant="outline"
        onClick={() => addWater(1000)}
        size={"sm"}
        className={imperialSystem ? "hidden" : "flex"}
      >
        <div className="flex mr-1">
          <Droplets className="w-5 h-5 text-blue-600" />
          <Droplets className="w-5 h-5  text-blue-600" />
        </div>
        +1L
      </Button>

      {/* Full Bottle - 32oz */}
      <Button
        type="button"
        variant="outline"
        size={"sm"}
        onClick={() => addWater(24)}
        className={imperialSystem ? "flex" : "hidden"}
      >
        <div className="flex mr-1">
          <Droplets className="w-5 h-5 text-blue-600" />
          <Droplets className="w-5 h-5  text-blue-600" />
        </div>
        +32 oz
      </Button>
    </div>
  );
}
