import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ProductData {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

interface BarcodeScannerProps {
  onScan: (productData: ProductData) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onScan, onClose }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannerInitialized, setScannerInitialized] = useState(false);
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const { toast } = useToast();

  const fetchProductData = async (barcode: string): Promise<ProductData | null> => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();

      if (data.status === 1 && data.product) {
        const product = data.product;
        const nutriments = product.nutriments || {};

        return {
          name: product.product_name || "Unknown Product",
          calories: Math.round(nutriments["energy-kcal_100g"] || 0),
          protein: Math.round(nutriments.proteins_100g || 0),
          carbs: Math.round(nutriments.carbohydrates_100g || 0),
          fat: Math.round(nutriments.fat_100g || 0),
        };
      }
      return null;
    } catch (error) {
      console.error("Error fetching product data:", error);
      return null;
    }
  };

  const startScanner = async () => {
    try {
      const scanner = new Html5Qrcode("barcode-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        async (decodedText) => {
          // Stop scanning immediately
          if (scannerRef.current) {
            await scannerRef.current.stop();
            scannerRef.current.clear();
            scannerRef.current = null;
          }
          setIsScanning(false);

          // Fetch product data
          const productData = await fetchProductData(decodedText);
          
          if (productData) {
            onScan(productData);
            toast({
              title: "Product found",
              description: `Scanned: ${productData.name}`,
            });
          } else {
            toast({
              title: "Product not found",
              description: "Could not find nutritional data for this barcode",
              variant: "destructive",
            });
          }
        },
        (errorMessage) => {
          // Scanning error (ignore these, they happen constantly)
        }
      );

      setIsScanning(true);
      setScannerInitialized(true);
    } catch (error) {
      console.error("Error starting scanner:", error);
      toast({
        title: "Camera error",
        description: "Could not access camera. Please check permissions.",
        variant: "destructive",
      });
    }
  };

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
        scannerRef.current.clear();
        scannerRef.current = null;
        setIsScanning(false);
        setScannerInitialized(false);
      } catch (error) {
        console.error("Error stopping scanner:", error);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, []);

  return (
    <Card className="p-6 space-y-4" data-testid="card-barcode-scanner">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Scan Barcode</h3>
        <Button
          size="icon"
          variant="ghost"
          onClick={onClose}
          data-testid="button-close-scanner"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="space-y-4">
        {!isScanning && !scannerInitialized && (
          <div className="text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Position a product barcode in front of your camera to automatically fill nutritional data from Open Food Facts
            </p>
            <Button
              onClick={startScanner}
              className="w-full"
              data-testid="button-start-scan"
            >
              <Camera className="h-4 w-4 mr-2" />
              Start Camera
            </Button>
          </div>
        )}

        <div
          id="barcode-reader"
          className="w-full"
          data-testid="div-scanner-viewport"
        />

        {isScanning && (
          <Button
            onClick={stopScanner}
            variant="destructive"
            className="w-full"
            data-testid="button-stop-scan"
          >
            Stop Scanning
          </Button>
        )}
      </div>
    </Card>
  );
}
