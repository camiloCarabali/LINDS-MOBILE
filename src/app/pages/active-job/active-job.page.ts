import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { StorageService } from '../../services/storage.service';
import { environment } from '../../../environments/environment';
import { from, switchMap } from 'rxjs';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';

// Fix para los iconos de Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

@Component({
  selector: 'app-active-job',
  templateUrl: './active-job.page.html',
  styleUrls: ['./active-job.page.scss'],
})
export class ActiveJobPage implements OnInit {

  @ViewChild('mapElement', { static: false }) mapElement!: ElementRef;

  activeJob: any = null;
  isLoading: boolean = true;
  isNavigating: boolean = false;
  showJobInfo: boolean = true;
  
  map: any;
  currentLocationMarker: any;
  routePolyline: any;
  watchId: any;

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

  ionViewWillLeave() {
    // Limpiar el mapa al salir de la página
    if (this.map) {
      this.map.remove();
      this.map = null;
      this.currentLocationMarker = null;
      this.routePolyline = null;
    }
    
    // Detener navegación si está activa
    if (this.isNavigating) {
      this.stopNavigation();
    }
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
          // Esperar un poco para que el DOM se renderice y luego inicializar el mapa
          setTimeout(() => {
            this.initMap();
          }, 500);
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

  async initMap() {
    try {
      if (!this.activeJob) return;

      // Verificar si el mapa ya está inicializado
      if (this.map) {
        console.log('ℹ️ Mapa ya inicializado, actualizando vista...');
        const position = await Geolocation.getCurrentPosition();
        const currentLocation: L.LatLngExpression = [
          position.coords.latitude,
          position.coords.longitude
        ];
        this.map.setView(currentLocation, 13);
        
        if (this.currentLocationMarker) {
          this.currentLocationMarker.setLatLng(currentLocation);
        }
        
        if (this.activeJob.origen && this.activeJob.destino) {
          await this.calculateRoute();
        }
        return;
      }

      // Obtener la ubicación actual
      const position = await Geolocation.getCurrentPosition();
      const currentLocation: L.LatLngExpression = [
        position.coords.latitude,
        position.coords.longitude
      ];

      // Crear el mapa centrado en la ubicación actual
      this.map = L.map(this.mapElement.nativeElement).setView(currentLocation, 13);

      // Agregar capa de tiles de OpenStreetMap (GRATIS)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19
      }).addTo(this.map);

      // Agregar marcador de ubicación actual
      this.currentLocationMarker = L.circleMarker(currentLocation, {
        radius: 10,
        fillColor: '#4285F4',
        fillOpacity: 1,
        color: '#ffffff',
        weight: 2
      }).addTo(this.map);

      this.currentLocationMarker.bindPopup('Mi Ubicación').openPopup();

      // Si hay origen y destino, mostrar marcadores
      if (this.activeJob.origen && this.activeJob.destino) {
        await this.calculateRoute();
      }

      console.log('✅ Mapa Leaflet inicializado correctamente');
    } catch (error) {
      console.error('❌ Error inicializando mapa:', error);
    }
  }

  async calculateRoute() {
    try {
      // Geocodificar origen y destino usando Nominatim (gratuito)
      const origenCoords = await this.geocodeAddress(this.activeJob.origen);
      const destinoCoords = await this.geocodeAddress(this.activeJob.destino);

      if (origenCoords && destinoCoords) {
        // Agregar marcadores
        L.marker(origenCoords).addTo(this.map)
          .bindPopup(`<b>Origen:</b><br>${this.activeJob.origen}`)
          .openPopup();

        L.marker(destinoCoords).addTo(this.map)
          .bindPopup(`<b>Destino:</b><br>${this.activeJob.destino}`);

        // Calcular ruta real usando OSRM (gratuito, sin API key)
        const route = await this.getRoute(origenCoords, destinoCoords);
        
        if (route && route.length > 0) {
          // Dibujar ruta real por carreteras
          this.routePolyline = L.polyline(route, {
            color: '#4285F4',
            weight: 5,
            opacity: 0.7
          }).addTo(this.map);

          // Ajustar vista para mostrar toda la ruta
          const bounds = L.latLngBounds(route);
          this.map.fitBounds(bounds, { padding: [50, 50] });

          console.log('✅ Ruta optimizada dibujada');
        } else {
          // Fallback a línea recta si falla el routing
          this.routePolyline = L.polyline([origenCoords, destinoCoords], {
            color: '#FF6B6B',
            weight: 5,
            opacity: 0.7,
            dashArray: '10, 10'
          }).addTo(this.map);

          const bounds = L.latLngBounds([origenCoords, destinoCoords]);
          this.map.fitBounds(bounds, { padding: [50, 50] });
          
          console.log('⚠️ Usando línea recta (routing no disponible)');
        }
      }
    } catch (error) {
      console.error('❌ Error calculando ruta:', error);
    }
  }

  async getRoute(start: L.LatLngExpression, end: L.LatLngExpression): Promise<L.LatLngExpression[]> {
    try {
      const startCoords = Array.isArray(start) ? start : [start.lat, start.lng];
      const endCoords = Array.isArray(end) ? end : [end.lat, end.lng];
      
      // Usar OSRM (Open Source Routing Machine) - Servidor público GRATUITO
      const url = `https://router.project-osrm.org/route/v1/driving/${startCoords[1]},${startCoords[0]};${endCoords[1]},${endCoords[0]}?overview=full&geometries=geojson`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        // Convertir coordenadas de GeoJSON a Leaflet LatLng
        const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => {
          return [coord[1], coord[0]] as L.LatLngExpression; // GeoJSON usa [lng, lat], Leaflet usa [lat, lng]
        });
        
        const distance = (data.routes[0].distance / 1000).toFixed(2); // km
        const duration = Math.round(data.routes[0].duration / 60); // minutos
        
        console.log(`📍 Ruta calculada: ${distance} km, ~${duration} minutos`);
        
        return coordinates;
      }
      
      return [];
    } catch (error) {
      console.error('Error obteniendo ruta:', error);
      return [];
    }
  }

  async geocodeAddress(address: string): Promise<L.LatLngExpression | null> {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
      return null;
    } catch (error) {
      console.error('Error geocoding:', error);
      return null;
    }
  }

  async startNavigation() {
    this.isNavigating = true;
    console.log('Iniciando navegación...');
    
    // Iniciar seguimiento de ubicación en tiempo real
    try {
      this.watchId = await Geolocation.watchPosition({
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }, (position, err) => {
        if (position) {
          const newLocation: L.LatLngExpression = [
            position.coords.latitude,
            position.coords.longitude
          ];
          
          // Actualizar marcador de ubicación actual
          if (this.currentLocationMarker) {
            this.currentLocationMarker.setLatLng(newLocation);
          }
          
          // Centrar mapa en la nueva ubicación
          if (this.map) {
            this.map.panTo(newLocation);
          }
          
          console.log('📍 Ubicación actualizada:', newLocation);
        }
      });
    } catch (error) {
      console.error('❌ Error iniciando navegación:', error);
    }
  }

  async stopNavigation() {
    this.isNavigating = false;
    console.log('Deteniendo navegación...');
    
    // Detener seguimiento de ubicación
    if (this.watchId) {
      await Geolocation.clearWatch({ id: this.watchId });
      this.watchId = null;
    }
  }

  toggleJobInfo() {
    this.showJobInfo = !this.showJobInfo;
  }

  async centerMap() {
    try {
      const position = await Geolocation.getCurrentPosition();
      const currentLocation: L.LatLngExpression = [
        position.coords.latitude,
        position.coords.longitude
      ];
      
      if (this.map) {
        this.map.setView(currentLocation, 15);
      }
      
      if (this.currentLocationMarker) {
        this.currentLocationMarker.setLatLng(currentLocation);
      }
      
      console.log('📍 Mapa centrado en ubicación actual');
    } catch (error) {
      console.error('❌ Error centrando mapa:', error);
    }
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