import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-active-job',
  templateUrl: './active-job.page.html',
  styleUrls: ['./active-job.page.scss'],
})
export class ActiveJobPage implements OnInit {

  activeJob = {
    id: '1',
    title: 'Transporte de Mercancía General',
    company: 'Logística Express SA',
    origin: 'Bogotá, Cundinamarca',
    destination: 'Medellín, Antioquia',
    distance: '416 km',
    payment: 850000,
    estimatedTime: '6h 30min',
    progress: 45,
    currentLocation: 'Puerto Boyacá, Boyacá'
  };

  isNavigating: boolean = false;
  showJobInfo: boolean = true;

  constructor() { }

  ngOnInit() {
  }

  startNavigation() {
    this.isNavigating = true;
    console.log('Iniciando navegación...');
    // Aquí se integraría con servicio de mapas
  }

  stopNavigation() {
    this.isNavigating = false;
    console.log('Deteniendo navegación...');
  }

  toggleJobInfo() {
    this.showJobInfo = !this.showJobInfo;
  }

  callClient() {
    console.log('Llamando al cliente...');
    // Implementar llamada
  }

  reportIssue() {
    console.log('Reportando problema...');
    // Implementar reporte de problemas
  }

  completeJob() {
    console.log('Completando trabajo...');
    // Implementar finalización del trabajo
  }

}