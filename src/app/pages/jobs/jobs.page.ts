import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { JobApplicationService } from '../../services';
import { Envio } from '../../interfaces/job-application.interface';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.page.html',
  styleUrls: ['./jobs.page.scss'],
})
export class JobsPage implements OnInit {
  envios: Envio[] = [];
  enviosFiltrados: Envio[] = [];
  searchTerm: string = '';
  isLoading: boolean = false;

  constructor(
    private jobApplicationService: JobApplicationService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) { }

  ngOnInit() {
    this.cargarEnvios();
  }

  ionViewWillEnter() {
    this.cargarEnvios();
  }

  cargarEnvios() {
    this.isLoading = true;
    this.jobApplicationService.getEnviosDisponibles().subscribe({
      next: (envios: Envio[]) => {
        console.log('✅ Envíos cargados exitosamente:', envios);
        this.envios = envios;
        this.enviosFiltrados = [...this.envios];
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('❌ Error cargando envíos:', error);
        console.error('Status:', error.status);
        console.error('Error detail:', error.error);
        this.showAlert('Error', 'No se pudieron cargar los envíos disponibles.');
        this.isLoading = false;
      }
    });
  }

  filterJobs(event: any) {
    const searchValue = event.target.value?.toLowerCase() || '';
    this.searchTerm = searchValue;

    if (!searchValue) {
      this.enviosFiltrados = [...this.envios];
      return;
    }

    this.enviosFiltrados = this.envios.filter(envio => 
      envio.origen.toLowerCase().includes(searchValue) ||
      envio.destino.toLowerCase().includes(searchValue) ||
      envio.tipo_carga.toLowerCase().includes(searchValue) ||
      envio.descripcion?.toLowerCase().includes(searchValue)
    );
  }

  async applyForJob(envio: Envio, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    const alert = await this.alertController.create({
      header: 'Aplicar a Envío',
      message: '¿Deseas agregar un mensaje con tu aplicación?',
      inputs: [
        {
          name: 'mensaje',
          type: 'textarea',
          placeholder: 'Mensaje opcional...',
          attributes: {
            maxlength: 500
          }
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aplicar',
          handler: (data) => {
            this.enviarAplicacion(envio.id, data.mensaje);
          }
        }
      ]
    });

    await alert.present();
  }

  async enviarAplicacion(envioId: number, mensaje: string) {
    const loading = await this.loadingController.create({
      message: 'Enviando aplicación...'
    });
    await loading.present();

    this.jobApplicationService.aplicarAEnvio({
      envio_id: envioId,
      mensaje: mensaje || undefined
    }).subscribe({
      next: async () => {
        await loading.dismiss();
        await this.showSuccessAlert('Aplicación enviada', 'Tu aplicación ha sido enviada exitosamente.');
        this.cargarEnvios();
      },
      error: async (error: any) => {
        await loading.dismiss();
        const errorMsg = error?.error?.detail || 'No se pudo enviar la aplicación. Por favor intenta de nuevo.';
        this.showAlert('Error', errorMsg);
      }
    });
  }

  refreshJobs() {
    this.cargarEnvios();
  }

  doRefresh(event: any) {
    this.jobApplicationService.getEnviosDisponibles().subscribe({
      next: (envios: Envio[]) => {
        this.envios = envios;
        this.enviosFiltrados = [...this.envios];
        event.target.complete();
      },
      error: (error: any) => {
        console.error('Error refrescando:', error);
        event.target.complete();
      }
    });
  }

  viewJobDetails(envio: Envio) {
    this.router.navigate(['/envio-detalle', envio.id]);
  }

  getPaymentText(envio: Envio): string {
    return `$${envio.valor.toLocaleString('es-CO')}`;
  }

  formatearFecha(fecha: string): string {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  }

  calcularVolumen(envio: Envio): string {
    const volumen = (envio.largo || 0) * (envio.ancho || 0) * (envio.alto || 0);
    return volumen.toFixed(2);
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async showSuccessAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: 'success-alert'
    });
    await alert.present();
  }
}