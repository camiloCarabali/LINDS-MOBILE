import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DriverService, DriverProfileCreate } from '../../services/driver.service';

@Component({
  selector: 'app-driver-setup',
  templateUrl: './driver-setup.page.html',
  styleUrls: ['./driver-setup.page.scss'],
})
export class DriverSetupPage implements OnInit {
  currentStep = 1;
  isSubmitting = false;

  // Datos del formulario
  formData: DriverProfileCreate = {
    vehicle_type: '',
    vehicle_plate: '',
    vehicle_capacity_kg: 0,
    vehicle_year: undefined,
    vehicle_photo_url: undefined,
    license_number: '',
    license_category: '',
    license_expiry_date: '',
    license_photo_url: undefined,
    phone: '',
    city: '',
    years_experience: 0,
    description: undefined
  };

  // Fechas min y max para el date picker
  minDate: string;
  maxDate: string;
  minDateString: string;
  maxDateString: string;

  constructor(
    private router: Router,
    private driverService: DriverService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {
    // Configurar fechas para el datepicker (la licencia debe vencer en el futuro)
    const today = new Date();
    this.minDate = today.toISOString();
    this.minDateString = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD
    
    const maxDateValue = new Date();
    maxDateValue.setFullYear(maxDateValue.getFullYear() + 10);
    this.maxDate = maxDateValue.toISOString();
    this.maxDateString = maxDateValue.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  }

  ngOnInit() {
    // Verificar si el usuario ya tiene perfil (por si acaso)
    this.driverService.checkProfile().subscribe({
      next: (profile) => {
        if (profile) {
          // Ya tiene perfil, redirigir a jobs
          console.log('User already has profile, redirecting...');
          this.router.navigate(['/tabs/jobs']);
        }
      },
      error: (error) => {
        console.error('Error checking profile:', error);
      }
    });
  }

  get progress(): number {
    return this.currentStep / 3;
  }

  nextStep() {
    if (this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  // Validaciones por paso
  isStep1Valid(): boolean {
    return !!(
      this.formData.vehicle_type &&
      this.formData.vehicle_plate &&
      this.formData.vehicle_capacity_kg > 0
    );
  }

  isStep2Valid(): boolean {
    return !!(
      this.formData.license_number &&
      this.formData.license_category &&
      this.formData.license_expiry_date
    );
  }

  isStep3Valid(): boolean {
    return !!(
      this.formData.phone &&
      this.formData.city
    );
  }

  // Métodos para fotos (implementar después con Capacitor Camera)
  async takeVehiclePhoto() {
    // TODO: Implementar con @capacitor/camera
    console.log('Take vehicle photo');
  }

  async takeLicensePhoto() {
    // TODO: Implementar con @capacitor/camera
    console.log('Take license photo');
  }

  async submitProfile() {
    if (!this.isStep1Valid() || !this.isStep2Valid() || !this.isStep3Valid()) {
      await this.showAlert('Error', 'Por favor completa todos los campos requeridos.');
      return;
    }

    this.isSubmitting = true;
    const loading = await this.loadingCtrl.create({
      message: 'Guardando tu perfil...',
    });
    await loading.present();

    try {
      // Formatear fecha de licencia al formato esperado por el backend (YYYY-MM-DD)
      const expiryDate = new Date(this.formData.license_expiry_date);
      this.formData.license_expiry_date = expiryDate.toISOString().split('T')[0];

      // Limpiar campos opcionales vacíos
      if (!this.formData.vehicle_year) {
        delete this.formData.vehicle_year;
      }
      if (!this.formData.description || this.formData.description.trim() === '') {
        delete this.formData.description;
      }

      // Enviar al backend
      this.driverService.createProfile(this.formData).subscribe({
        next: async (profile) => {
          console.log('Profile created successfully:', profile);
          await loading.dismiss();
          
          await this.showSuccessAlert();
          
          // Navegar a la página principal
          this.router.navigate(['/tabs/jobs']);
        },
        error: async (error) => {
          console.error('Error creating profile:', error);
          await loading.dismiss();
          
          let errorMessage = 'Error al guardar el perfil. Intenta nuevamente.';
          
          if (error.error?.detail) {
            if (typeof error.error.detail === 'string') {
              errorMessage = error.error.detail;
            } else if (Array.isArray(error.error.detail)) {
              errorMessage = error.error.detail.map((e: any) => e.msg).join(', ');
            }
          }
          
          await this.showAlert('Error', errorMessage);
          this.isSubmitting = false;
        }
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      await loading.dismiss();
      await this.showAlert('Error', 'Ocurrió un error inesperado. Intenta nuevamente.');
      this.isSubmitting = false;
    }
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
      header: '¡Perfil Completado!',
      message: 'Tu perfil de conductor ha sido creado exitosamente. Ya puedes empezar a buscar trabajos.',
      buttons: ['Comenzar']
    });
    await alert.present();
  }
}
