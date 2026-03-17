import { Component, OnInit, AfterViewInit, OnDestroy, ElementRef, ViewChild, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as L from 'leaflet';

@Component({
  selector: 'app-fleet-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './fleet-tracking.component.html',
  styleUrls: ['./fleet-tracking.component.css']
})
export class FleetTrackingComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  
  searchQuery: string = '';
  systemTime: string = '';
  private map!: L.Map;
  private shipmentLayer = L.layerGroup();
  private timeInterval: any;
  private resizeObserver!: ResizeObserver;

  locDb: any = {
    "ennore": { lat: 13.2325, lng: 80.3297, name: "ENNORE_PORT_NODE" },
    "oragadam": { lat: 12.8342, lng: 79.9482, name: "ORAGADAM_HUB" },
    "chennai": { lat: 13.0827, lng: 80.2707, name: "CHENNAI_CENTRAL" },
    "avadi": { lat: 13.1143, lng: 80.1100, name: "AVADI_NODE" },
    "mumbai": { lat: 19.0760, lng: 72.8777, name: "MUMBAI_GATEWAY" },
    "delhi": { lat: 28.6139, lng: 77.2090, name: "DELHI_NORTH_HUB" }
  };

  currentMapData = { lat: 13.0827, lng: 80.2707, label: "CHENNAI_SECTOR", activeSats: 8 };
  tacticalAlerts = [
    { type: 'warning', status: '🟢 OPTIMAL', action: 'Sim-Link Active' },
    { type: 'info', status: '📡 SYNC', action: 'Neural Pathing Updated' }
  ];

  constructor(private zone: NgZone) {}

  ngOnInit() {
    this.updateTime();
    this.timeInterval = setInterval(() => this.updateTime(), 1000);
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => {
        if (this.map) {
          this.map.invalidateSize({ animate: false });
        }
      });
      this.resizeObserver.observe(this.mapContainer.nativeElement);
    });

    setTimeout(() => this.initMap(), 300);
  }

  ngOnDestroy() {
    if (this.timeInterval) clearInterval(this.timeInterval);
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.map) {
      this.map.off();
      this.map.remove();
    }
  }

  private initMap() {
    // We strictly define the map to behave as a single static window
    this.map = L.map('map-viewport', { 
      zoomControl: false,
      attributionControl: false,
      fadeAnimation: false, 
      zoomAnimation: false, // Disabled to prevent tile "popping"
      inertia: false,
      boxZoom: false,
      doubleClickZoom: false
    }).setView([13.0827, 80.2707], 12);

    // FIX: tileSize: 1024 forces Leaflet to request 4x larger areas.
    // Effectively making the entire visible window ONE SINGLE TILE.
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 15,
      minZoom: 10,
      noWrap: true,
      tileSize: 1024, 
      zoomOffset: -2, // Compensate for the larger tile size
      keepBuffer: 10,
      updateWhenIdle: true
    }).addTo(this.map);

    this.shipmentLayer.addTo(this.map);
    this.generateShipments(13.0827, 80.2707);

    this.map.invalidateSize();
  }

  private generateShipments(lat: number, lng: number) {
    this.shipmentLayer.clearLayers();
    const shipmentIcon = L.divIcon({
      className: 'shipment-container',
      html: '<div class="blue-ping"></div>',
      iconSize: [12, 12]
    });

    for (let i = 0; i < 15; i++) {
      const rLat = lat + (Math.random() - 0.5) * 0.1;
      const rLng = lng + (Math.random() - 0.5) * 0.1;
      L.marker([rLat, rLng], { icon: shipmentIcon }).addTo(this.shipmentLayer);
    }
  }

  updateTime() {
    this.systemTime = new Date().toLocaleTimeString();
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase().trim();
    if (this.locDb[query]) {
      const target = this.locDb[query];
      this.currentMapData = { ...target, label: target.name, activeSats: Math.floor(Math.random() * 4) + 6 };
      
      // Using setView instead of flyTo for instant "One Tile" snapping
      this.map.setView([target.lat, target.lng], 12);
      this.generateShipments(target.lat, target.lng);
    }
  }
}