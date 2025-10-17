import { HeartRateMonitor } from "@/components/HeartRateMonitor";
import { Card } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function Cardio() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Cardio Training</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Heart Rate Monitor */}
        <div>
          <HeartRateMonitor />
        </div>

        {/* Instructions & Tips */}
        <Card className="p-6 space-y-4">
          <h3 className="text-lg font-semibold">Training Tips</h3>
          <div className="space-y-3 text-sm text-muted-foreground">
            <div>
              <h4 className="font-semibold text-foreground mb-1">Zone 1 - Very Light (50-60% max HR)</h4>
              <p>Perfect for warm-up, cool-down, and active recovery days.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Zone 2 - Light (60-70% max HR)</h4>
              <p>Builds aerobic base and improves fat burning. Ideal for longer sessions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Zone 3 - Moderate (70-80% max HR)</h4>
              <p>Improves aerobic capacity. This is where you build cardiovascular fitness.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Zone 4 - Hard (80-90% max HR)</h4>
              <p>Lactate threshold training. Increases performance and VO2 max.</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-1">Zone 5 - Maximum (90-100% max HR)</h4>
              <p>Sprint intervals and max effort. Use sparingly for peak performance.</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-semibold mb-2">Browser Compatibility</h4>
            <p className="text-xs text-muted-foreground">
              Web Bluetooth requires Chrome, Edge, or Opera browser. Not supported in Safari or Firefox.
              Make sure to grant camera/Bluetooth permissions when prompted.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
