import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Bluetooth, BluetoothOff, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface HeartRateZone {
  name: string;
  min: number;
  max: number;
  color: string;
  description: string;
}

export function HeartRateMonitor() {
  const [isConnected, setIsConnected] = useState(false);
  const [heartRate, setHeartRate] = useState<number | null>(null);
  const [currentZone, setCurrentZone] = useState<number>(0);
  const [maxHeartRate, setMaxHeartRate] = useState(180); // Default, can be calculated from age
  const deviceRef = useRef<BluetoothDevice | null>(null);
  const characteristicRef = useRef<BluetoothRemoteGATTCharacteristic | null>(null);
  const previousZoneRef = useRef<number>(0);
  const { toast } = useToast();

  // Calculate heart rate zones based on max heart rate
  const zones: HeartRateZone[] = [
    {
      name: "Zone 1 - Very Light",
      min: Math.round(maxHeartRate * 0.5),
      max: Math.round(maxHeartRate * 0.6),
      color: "bg-gray-500",
      description: "Warm-up, recovery",
    },
    {
      name: "Zone 2 - Light",
      min: Math.round(maxHeartRate * 0.6),
      max: Math.round(maxHeartRate * 0.7),
      color: "bg-blue-500",
      description: "Fat burning, endurance",
    },
    {
      name: "Zone 3 - Moderate",
      min: Math.round(maxHeartRate * 0.7),
      max: Math.round(maxHeartRate * 0.8),
      color: "bg-green-500",
      description: "Aerobic fitness",
    },
    {
      name: "Zone 4 - Hard",
      min: Math.round(maxHeartRate * 0.8),
      max: Math.round(maxHeartRate * 0.9),
      color: "bg-yellow-500",
      description: "Performance training",
    },
    {
      name: "Zone 5 - Maximum",
      min: Math.round(maxHeartRate * 0.9),
      max: maxHeartRate,
      color: "bg-red-500",
      description: "Sprint, max effort",
    },
  ];

  const getZoneFromHeartRate = (bpm: number): number => {
    for (let i = 0; i < zones.length; i++) {
      if (bpm >= zones[i].min && bpm <= zones[i].max) {
        return i;
      }
    }
    return bpm > zones[zones.length - 1].max ? zones.length - 1 : 0;
  };

  const connectToDevice = async () => {
    try {
      if (!navigator.bluetooth) {
        toast({
          title: "Bluetooth not supported",
          description: "Your browser doesn't support Web Bluetooth API. Try Chrome, Edge, or Opera.",
          variant: "destructive",
        });
        return;
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ["heart_rate"] }],
      });

      deviceRef.current = device;

      device.addEventListener("gattserverdisconnected", () => {
        setIsConnected(false);
        setHeartRate(null);
        toast({
          title: "Disconnected",
          description: "Heart rate monitor disconnected",
        });
      });

      const server = await device.gatt?.connect();
      if (!server) throw new Error("Failed to connect to GATT server");

      const service = await server.getPrimaryService("heart_rate");
      const characteristic = await service.getCharacteristic("heart_rate_measurement");

      characteristicRef.current = characteristic;

      await characteristic.startNotifications();
      characteristic.addEventListener("characteristicvaluechanged", handleHeartRateChange);

      setIsConnected(true);
      toast({
        title: "Connected",
        description: `Connected to ${device.name || "Heart Rate Monitor"}`,
      });
    } catch (error) {
      console.error("Bluetooth connection error:", error);
      toast({
        title: "Connection failed",
        description: "Could not connect to heart rate monitor",
        variant: "destructive",
      });
    }
  };

  const handleHeartRateChange = (event: Event) => {
    const target = event.target as BluetoothRemoteGATTCharacteristic;
    const value = target.value;
    if (!value) return;

    const flags = value.getUint8(0);
    const rate = flags & 0x01 ? value.getUint16(1, true) : value.getUint8(1);

    setHeartRate(rate);

    const zone = getZoneFromHeartRate(rate);
    setCurrentZone(zone);

    // Check for zone transition
    if (zone !== previousZoneRef.current) {
      toast({
        title: `Entered ${zones[zone].name}`,
        description: zones[zone].description,
      });
      previousZoneRef.current = zone;
    }
  };

  const disconnect = async () => {
    if (deviceRef.current?.gatt?.connected) {
      deviceRef.current.gatt.disconnect();
    }
    setIsConnected(false);
    setHeartRate(null);
  };

  useEffect(() => {
    return () => {
      if (deviceRef.current?.gatt?.connected) {
        deviceRef.current.gatt.disconnect();
      }
    };
  }, []);

  const heartRatePercentage = heartRate ? (heartRate / maxHeartRate) * 100 : 0;

  return (
    <Card className="p-6 space-y-6" data-testid="card-heart-rate-monitor">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="h-6 w-6 text-red-500" />
          <h3 className="text-lg font-semibold">Heart Rate Monitor</h3>
        </div>
        {!isConnected ? (
          <Button
            onClick={connectToDevice}
            data-testid="button-connect-hr"
          >
            <Bluetooth className="h-4 w-4 mr-2" />
            Connect
          </Button>
        ) : (
          <Button
            onClick={disconnect}
            variant="outline"
            data-testid="button-disconnect-hr"
          >
            <BluetoothOff className="h-4 w-4 mr-2" />
            Disconnect
          </Button>
        )}
      </div>

      {isConnected && heartRate !== null ? (
        <div className="space-y-6">
          {/* Current Heart Rate */}
          <div className="text-center space-y-2">
            <div className="text-6xl font-mono font-bold" data-testid="text-heart-rate">
              {heartRate}
            </div>
            <div className="text-sm text-muted-foreground">BPM</div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={heartRatePercentage} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0</span>
              <span>{maxHeartRate} max</span>
            </div>
          </div>

          {/* Current Zone */}
          <div
            className={`p-4 rounded-lg ${zones[currentZone].color} bg-opacity-20 border-2 border-current`}
            data-testid="div-current-zone"
          >
            <div className="text-sm font-semibold">{zones[currentZone].name}</div>
            <div className="text-xs opacity-80">
              {zones[currentZone].min}-{zones[currentZone].max} BPM • {zones[currentZone].description}
            </div>
          </div>

          {/* All Zones */}
          <div className="space-y-2">
            <div className="text-sm font-semibold">Heart Rate Zones</div>
            {zones.map((zone, index) => (
              <div
                key={index}
                className={`flex items-center justify-between p-2 rounded-md ${
                  index === currentZone ? "bg-secondary" : "bg-background"
                }`}
                data-testid={`div-zone-${index + 1}`}
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${zone.color}`} />
                  <span className="text-sm">{zone.name}</span>
                </div>
                <span className="text-xs font-mono text-muted-foreground">
                  {zone.min}-{zone.max}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">
            {isConnected
              ? "Waiting for heart rate data..."
              : "Connect your Bluetooth heart rate monitor to start tracking"}
          </p>
          <p className="text-xs mt-2">
            Compatible with most BLE heart rate monitors
          </p>
        </div>
      )}
    </Card>
  );
}
