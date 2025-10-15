import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { JobApplicationService } from '../../services';
import { Envio } from '../../interfaces/job-application.interface';

@Component({
  selector: 'app-envios-disponibles',
  templateUrl: './envios-disponibles.page.html',
  styleUrls: ['./envios-disponibles.page.scss'],
})
export class EnviosDisponiblesPage implements OnInit {
  envios: Envio[] = [];
  enviosFiltrados: Envio[] = [];
  isLoading = false;
  searchTerm = '';

  constructor(
    private router: Router,
    private jobAppService: JobApplicationService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  async ngOnInit() {
    await this.cargarEnvios();
  }

  async ionViewWillEnter() {
    // Recargar cada vez que se entre a la página
    await this.cargarEnvios();
  }

  async cargarEnvios() {
    this.isLoading = true;
    const loading = await this.loadingCtrl.create({
      message: 'Cargando envíos disponibles...',
    });
    await loading.present();

    this.jobAppService.getEnviosDisponibles().subscribe({
      next: (envios: Envio[]) => {
        this.envios = envios;
        this.enviosFiltrados = envios;
        loading.dismiss();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error al cargar envíos:', error);
        loading.dismiss();
        this.isLoading = false;
        this.showAlert('Error', 'No se pudieron cargar los envíos disponibles.');
      }
    });
  }

  filterEnvios(event: any) {
    this.searchTerm = event.target.value.toLowerCase();
    
    if (!this.searchTerm) {
      this.enviosFiltrados = this.envios;
      return;
    }

    this.enviosFiltrados = this.envios.filter(envio =>
      envio.origen.toLowerCase().includes(this.searchTerm) ||
      envio.destino.toLowerCase().includes(this.searchTerm) ||
      envio.tipo_carga.toLowerCase().includes(this.searchTerm)
    );
  }

  verDetalle(envio: Envio) {
    this.router.navigate(['/envio-detalle', envio.id]);
  }

  async aplicar(envio: Envio, event: Event) {
    event.stopPropagation(); // Evitar que se dispare verDetalle

    const alert = await this.alertCtrl.create({
      header: 'Aplicar al Envío',
      message: `¿Deseas aplicar para este envío de ${envio.origen} a ${envio.destino}?`,
      inputs: [
        {
          name: 'mensaje',
          type: 'textarea',
          placeholder: 'Mensaje opcional (experiencia, disponibilidad, etc.)'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Aplicar',
          handler: async (data) => {
            await this.enviarAplicacion(envio.id, data.mensaje);
          }
        }
      ]
    });

    await alert.present();
  }

  async enviarAplicacion(envioId: number, mensaje?: string) {
    const loading = await this.loadingCtrl.create({
      message: 'Enviando aplicación...',
    });
    await loading.present();

    this.jobAppService.aplicarAEnvio({
      envio_id: envioId,
      mensaje: mensaje || undefined
    }).subscribe({
      next: async () => {
        await loading.dismiss();
        await this.showSuccessAlert();
        await this.cargarEnvios(); // Recargar lista
      },
      error: async (error: any) => {
        await loading.dismiss();
        const errorMsg = error.error?.detail || 'No se pudo enviar la aplicación';
        await this.showAlert('Error', errorMsg);
      }
    });
  }

  calcularVolumen(envio: Envio): number {
    return envio.largo * envio.ancho * envio.alto;
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  async doRefresh(event: any) {
    await this.cargarEnvios();
    event.target.complete();
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showSuccessAlert() {
    const alert = await this.alertCtrl.create({
      header: '¡Aplicación Enviada!',
      message: 'Tu aplicación ha sido enviada exitosamente. Te notificaremos cuando el cliente la revise.',
      buttons: ['Entendido']
    });
    await alert.present();
  }
}
