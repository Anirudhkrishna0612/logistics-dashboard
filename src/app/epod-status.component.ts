import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-epod-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './epod-status.component.html',
  styleUrls: ['./epod-status.component.css']
})
export class EpodStatusComponent implements OnInit {
  systemTime: string = '';
  showModal: boolean = false;
  selectedPOD: any = null;

  deliveryData = [
    { routeId: 'RT-101', customer: 'Anirudh Krishna', contact: '+91 98765 43210', address: 'Ennore Port, Chennai', status: 'Submitted', timestamp: '14:20', lat: '13.2325', lng: '80.3297' },
    { routeId: 'RT-104', customer: 'Darshaan Arun', contact: '+91 98765 43211', address: 'Oragadam Hub', status: 'Pending', timestamp: '12:20', lat: '12.8335', lng: '79.9547' },
    { routeId: 'RT-109', customer: 'Alwin Tamilselvan', contact: '+91 98765 93212', address: 'Chennai Central', status: 'Submitted', timestamp: '19:05', lat: '13.6727', lng: '80.2707' },
    { routeId: 'RT-109', customer: 'Baskar S', contact: '+91 92365 46712', address: 'Sriperumbatur', status: 'Submitted', timestamp: '10:50', lat: '13.2327', lng: '81.825' },
    { routeId: 'RT-109', customer: 'Hariraghav V', contact: '+91 93455 98712', address: 'Poonamalle', status: 'Pending', timestamp: '09:40', lat: '14.427', lng: '78.297' }
  ];

  ngOnInit() {
    this.systemTime = new Date().toLocaleTimeString();
    setInterval(() => { this.systemTime = new Date().toLocaleTimeString(); }, 1000);
  }

  openPOD(item: any) {
    if (item.status === 'Submitted') {
      this.selectedPOD = item;
      this.showModal = true;
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedPOD = null;
  }
}