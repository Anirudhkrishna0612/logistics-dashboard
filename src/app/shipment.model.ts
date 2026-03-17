export interface ShipmentData {
  shipmentId: string;
  date: string;
  route: string; // Route A to Route E
  distance: number; // 10 to 500
  trafficLevel: string; // Low, Medium, High
  weather: string; // Clear, Rainy, Foggy, Stormy
  stops: number; // 1 to 15
  vehicleId: string;
  driverId: string;
  load: number;
  capacity: number;
  inventoryLevel: number;
}

export interface PredictionResult {
  delivery_hours: number;
  risk_level: string;
  risk_emoji: string;
  demand_units: number;
  insights: string[];
}