import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { DriverService, DriverProfile } from '../../services/driver.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  profile: DriverProfile | null = null;
  isLoading = true;

  // Form data
  formData = {
    vehicle_type: '',
    vehicle_plate: '',
    vehicle_capacity_kg: 0,
    vehicle_year: undefined as number | undefined,
    license_number: '',
    license_category: '',
    license_expiry_date: '',
    phone: '',
    city: '',
    years_experience: 0,
    description: ''
  };

  constructor(
    private driverService: DriverService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) { }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.isLoading = true;
    
    this.driverService.getProfile().subscribe({
      next: (profile) => {
        console.log('✅ Profile loaded for editing:', profile);
        this.profile = profile;
        
        // Cargar datos en el formulario
        this.formData = {
          vehicle_type: profile.vehicle_type,
          vehicle_plate: profile.vehicle_plate,
          vehicle_capacity_kg: profile.vehicle_capacity_kg,
          vehicle_year: profile.vehicle_year,
          license_number: profile.license_number,
          license_category: profile.license_category,
          license_expiry_date: profile.license_expiry_date,
          phone: profile.phone,
          city: profile.city,
          years_experience: profile.years_experience,
          description: profile.description || ''
        };
        
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading profile:', error);
        this.isLoading = false;
        this.showAlert('Error', 'No se pudo cargar el perfil. Intenta nuevamente.');
      }
    });
  }

  async saveChanges() {
    // Validar campos requeridos
    if (!this.validateForm()) {
      return;
    }

    const loading = await this.loadingCtrl.create({
      message: 'Guardando cambios...'
    });
    await loading.present();

    try {
      // Convertir capacidad a número si es string
      const updateData = {
        ...this.formData,
        vehicle_capacity_kg: Number(this.formData.vehicle_capacity_kg),
        years_experience: Number(this.formData.years_experience)
      };

      this.driverService.updateProfile(updateData).subscribe({
        next: async (updatedProfile) => {
          console.log('✅ Profile updated:', updatedProfile);
          await loading.dismiss();
          
          await this.showSuccessAlert();
          this.router.navigate(['/tabs/profile']);
        },
        error: async (error) => {
          console.error('❌ Error updating profile:', error);
          await loading.dismiss();
          
          let errorMessage = 'No se pudo actualizar el perfil.';
          if (error.error?.detail) {
            if (Array.isArray(error.error.detail)) {
              errorMessage = error.error.detail.map((e: any) => e.msg).join('\n');
            } else {
              errorMessage = error.error.detail;
            }
          }
          
          this.showAlert('Error', errorMessage);
        }
      });
    } catch (error) {
      await loading.dismiss();
      console.error('Error:', error);
      this.showAlert('Error', 'Ocurrió un error inesperado.');
    }
  }

  validateForm(): boolean {
    if (!this.formData.vehicle_type || this.formData.vehicle_type.trim() === '') {
      this.showAlert('Campo requerido', 'El tipo de vehículo es obligatorio.');
      return false;
    }

    if (!this.formData.vehicle_plate || this.formData.vehicle_plate.trim() === '') {
      this.showAlert('Campo requerido', 'La placa del vehículo es obligatoria.');
      return false;
    }

    if (!this.formData.vehicle_capacity_kg || this.formData.vehicle_capacity_kg <= 0) {
      this.showAlert('Campo requerido', 'La capacidad de carga debe ser mayor a 0.');
      return false;
    }

    if (!this.formData.license_number || this.formData.license_number.trim() === '') {
      this.showAlert('Campo requerido', 'El número de licencia es obligatorio.');
      return false;
    }

    if (!this.formData.license_category || this.formData.license_category.trim() === '') {
      this.showAlert('Campo requerido', 'La categoría de licencia es obligatoria.');
      return false;
    }

    if (!this.formData.license_expiry_date) {
      this.showAlert('Campo requerido', 'La fecha de expiración de la licencia es obligatoria.');
      return false;
    }

    if (!this.formData.phone || this.formData.phone.trim() === '') {
      this.showAlert('Campo requerido', 'El teléfono es obligatorio.');
      return false;
    }

    if (!this.formData.city || this.formData.city.trim() === '') {
      this.showAlert('Campo requerido', 'La ciudad es obligatoria.');
      return false;
    }

    return true;
  }

  cancel() {
    this.router.navigate(['/tabs/profile']);
  }

  getTodayDate(): string {
    return new Date().toISOString().split('T')[0];
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
      header: '¡Perfil Actualizado!',
      message: 'Tu perfil se ha actualizado exitosamente.',
      buttons: ['OK']
    });
    await alert.present();
  }

}
