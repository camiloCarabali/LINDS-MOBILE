import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../../services/storage.service';
import { environment } from '../../../environments/environment';
import { from, switchMap } from 'rxjs';

@Component({
  selector: 'app-active-job',
  templateUrl: './active-job.page.html',
  styleUrls: ['./active-job.page.scss'],
})
export class ActiveJobPage implements OnInit {

  activeJob: any = null;
  isLoading: boolean = true;
  isNavigating: boolean = false;
  showJobInfo: boolean = true;

  constructor(
    private http: HttpClient,
    private storage: StorageService
  ) { }

  ngOnInit() {
    this.cargarTrabajoActivo();
  }

  ionViewWillEnter() {
    this.cargarTrabajoActivo();
  }

  cargarTrabajoActivo() {
    this.isLoading = true;
    
    // Obtener el token y el user_id
    from(Promise.all([
      this.storage.get('auth_token'),
      this.storage.get('current_user')
    ])).pipe(
      switchMap(([token, user]) => {
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        });
        
        console.log('🔍 Buscando trabajos activos para conductor:', user.id);
        
        // Buscar envíos donde el conductor actual esté asignado
        // Buscar en estados: asignado, en-proceso, en-transito
        return this.http.get<any[]>(
          `${environment.apiUrl}/envios?conductor_id=${user.id}`,
          { headers }
        );
      })
    ).subscribe({
      next: (envios) => {
        console.log('✅ Envíos obtenidos:', envios);
        
        // Filtrar solo los trabajos activos (asignado, en-proceso, en-transito)
        const trabajosActivos = envios.filter(e => 
          ['asignado', 'en-proceso', 'en-transito'].includes(e.estado)
        );
        
        console.log('📦 Trabajos activos filtrados:', trabajosActivos);
        
        if (trabajosActivos && trabajosActivos.length > 0) {
          this.activeJob = trabajosActivos[0]; // Tomar el primer trabajo activo
        } else {
          this.activeJob = null;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando trabajo activo:', error);
        this.activeJob = null;
        this.isLoading = false;
      }
    });
  }

  startNavigation() {
    this.isNavigating = true;
    console.log('Iniciando navegación...');
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
  }

  reportIssue() {
    console.log('Reportando problema...');
  }

  completeJob() {
    console.log('Completando trabajo...');
  }

}