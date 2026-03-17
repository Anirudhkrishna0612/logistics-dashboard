import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FleetTrackingComponent } from './fleet-tracking.component';
import { EpodStatusComponent } from './epod-status.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    HttpClientModule, 
    FleetTrackingComponent,
    EpodStatusComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  private http = inject(HttpClient);
  
  // UI & Auth States
  loading = false;
  isLoggedIn = false;
  currentTab = 'home'; 
  apiUrl = 'http://127.0.0.1:5000/predict'; 

  // Form Models
  username = '';
  password = '';
  sensitivityValue: number = 75; 

  // Master Data List (Professional India Routes)
  shipmentList: any[] = [
    {
      shipment_id: 'SHIP-992',
      vehicle_id: 'VH-101',
      route: 'Mumbai - Delhi',
      weather: 'Clear',
      traffic_level: 'Low',
      delivery_hours: 12.5,
      risk_label: 'Low Risk',
      risk_emoji: '✅',
      predicted_demand: 320
    },
    {
      shipment_id: 'SHIP-401',
      vehicle_id: 'VH-205',
      route: 'Bangalore - Chennai',
      weather: 'Rainy',
      traffic_level: 'High',
      delivery_hours: 28.2,
      risk_label: 'High Risk',
      risk_emoji: '⚠️',
      predicted_demand: 510
    }
  ];

  // Navigation
  switchTab(tab: string) {
    this.currentTab = tab;
  }

  // Auth Logic
  login() {
    this.isLoggedIn = true;
    this.currentTab = 'home';
  }

  // Logout logic
  logout() {
    this.isLoggedIn = false;
    this.username = '';
    this.password = '';
  }

  // DYNAMIC STATS: Real-time count of "High Risk" items
  getTotalRisks(): number {
    return this.shipmentList.filter(s => s.risk_label === 'High Risk').length;
  }

  // CREATE: Logic for adding new shipments
  addNewShipment() {
    this.loading = true;
    const payload = {
      shipment_id: 'SHIP-' + Math.floor(Math.random() * 999),
      route: 'Delhi - Kolkata',
      weather: 'Stormy',
      traffic_level: 'High',
      load: 500,
      capacity: 1000,
      distance_km: 200,
      stops: 4,
      inventory_level: 450,
      vehicle_id: 'VH-' + Math.floor(Math.random() * 999)
    };

    this.http.post(this.apiUrl, payload).subscribe({
      next: (response: any) => {
        this.shipmentList.unshift({ ...response, vehicle_id: payload.vehicle_id });
        this.loading = false;
      },
      error: (err) => {
        console.warn("Backend unreachable, triggering AI simulation fallback...");
        setTimeout(() => {
          this.shipmentList.unshift({
            shipment_id: payload.shipment_id,
            vehicle_id: payload.vehicle_id,
            route: payload.route,
            weather: payload.weather,
            traffic_level: payload.traffic_level,
            delivery_hours: 31.4,
            risk_label: 'High Risk',
            risk_emoji: '⚠️',
            predicted_demand: 485
          });
          this.loading = false;
        }, 1200);
      }
    });
  }

  // DELETE: Logic
  deleteShipment(index: number) {
    if (confirm("Remove this vehicle from AI tracking?")) {
      this.shipmentList.splice(index, 1);
    }
  }
}