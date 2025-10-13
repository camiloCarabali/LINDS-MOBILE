import { Component, OnInit } from '@angular/core';

export interface Job {
  id: string;
  title: string;
  company: string;
  origin: string;
  destination: string;
  distance: string;
  payment: number;
  deadline: Date;
  description: string;
  cargo: string;
  weight: string;
  status: 'available' | 'taken' | 'completed';
}

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {

  jobs: Job[] = [
    {
      id: '1',
      title: 'Transporte de Mercancía General',
      company: 'Logística Express SA',
      origin: 'Bogotá, Cundinamarca',
      destination: 'Medellín, Antioquia',
      distance: '416 km',
      payment: 850000,
      deadline: new Date('2025-10-15'),
      description: 'Transporte de productos de consumo masivo desde Bogotá hasta Medellín.',
      cargo: 'Productos de consumo',
      weight: '12 toneladas',
      status: 'available'
    },
    {
      id: '2',
      title: 'Entrega de Materiales de Construcción',
      company: 'Construcciones del Valle',
      origin: 'Cali, Valle del Cauca',
      destination: 'Popayán, Cauca',
      distance: '139 km',
      payment: 450000,
      deadline: new Date('2025-10-14'),
      description: 'Transporte urgente de cemento y varillas para obra en construcción.',
      cargo: 'Materiales construcción',
      weight: '15 toneladas',
      status: 'available'
    },
    {
      id: '3',
      title: 'Transporte de Productos Farmacéuticos',
      company: 'FarmaDistribuidora Ltda',
      origin: 'Barranquilla, Atlántico',
      destination: 'Cartagena, Bolívar',
      distance: '106 km',
      payment: 380000,
      deadline: new Date('2025-10-13'),
      description: 'Transporte de medicamentos con cadena de frío requerida.',
      cargo: 'Productos farmacéuticos',
      weight: '5 toneladas',
      status: 'available'
    }
  ];

  filteredJobs: Job[] = [];
  searchTerm: string = '';

  constructor() { }

  ngOnInit() {
    this.filteredJobs = [...this.jobs];
  }

  filterJobs(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    
    if (this.searchTerm === '') {
      this.filteredJobs = [...this.jobs];
    } else {
      this.filteredJobs = this.jobs.filter(job => 
        job.title.toLowerCase().includes(this.searchTerm) ||
        job.company.toLowerCase().includes(this.searchTerm) ||
        job.origin.toLowerCase().includes(this.searchTerm) ||
        job.destination.toLowerCase().includes(this.searchTerm)
      );
    }
  }

  applyForJob(job: Job) {
    // Lógica para aplicar al trabajo
    console.log('Aplicando al trabajo:', job.title);
    // Aquí se implementaría la lógica para enviar la solicitud
  }

  viewJobDetails(job: Job) {
    // Navegación a detalles del trabajo
    console.log('Ver detalles del trabajo:', job.title);
    // Aquí se implementaría la navegación
  }

}