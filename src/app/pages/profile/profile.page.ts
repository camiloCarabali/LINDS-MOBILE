import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { DriverService } from '../../services/driver.service';
import { StorageService } from '../../services/storage.service';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  driver: any = null;
  currentUser: any = null;
  photoURL: string | null = null;
  isLoading = true;

  constructor(
    private driverService: DriverService,
    private storage: StorageService,
    private router: Router,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private auth: Auth
  ) { }

  async ngOnInit() {
    await this.loadProfile();
  }

  async ionViewWillEnter() {
    await this.loadProfile();
  }

  async loadProfile() {
    this.isLoading = true;
    
    try {
      // Obtener usuario actual del storage
      this.currentUser = await this.storage.get('current_user');
      console.log('👤 Current user:', this.currentUser);

      // Obtener foto de perfil de Firebase Auth o del usuario guardado
      const currentFirebaseUser = this.auth.currentUser;
      
      // Intentar obtener la foto de Firebase Auth primero
      if (currentFirebaseUser?.photoURL) {
        this.photoURL = currentFirebaseUser.photoURL;
        console.log('📸 Photo URL from Firebase Auth:', this.photoURL);
      } 
      // Si no está en Firebase Auth, intentar del usuario guardado (propiedad 'photo')
      else if (this.currentUser?.photo) {
        this.photoURL = this.currentUser.photo;
        console.log('📸 Photo URL from storage:', this.photoURL);
      }
      // Si aún no hay foto, log de debug
      else {
        console.log('⚠️ No photo URL found');
        console.log('Firebase user:', currentFirebaseUser);
        console.log('Storage user:', this.currentUser);
      }

      // Obtener perfil del conductor del backend
      this.driverService.getProfile().subscribe({
        next: (profile) => {
          console.log('✅ Driver profile loaded:', profile);
          this.driver = profile;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('❌ Error loading driver profile:', error);
          this.isLoading = false;
          
          // Si no tiene perfil, mostrar mensaje
          if (error.status === 404) {
            this.showAlert('Perfil Incompleto', 'No tienes un perfil de conductor. Por favor complétalo.');
            this.router.navigate(['/driver-setup']);
          }
        }
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      this.isLoading = false;
    }
  }

  editProfile() {
    console.log('Editando perfil...');
    this.router.navigate(['/edit-profile']);
  }

  addPaymentMethod() {
    console.log('Agregando método de pago...');
    // TODO: Implementar métodos de pago
  }

  viewPaymentHistory() {
    console.log('Ver historial de pagos...');
    // TODO: Implementar historial
  }

  async logout() {
    const alert = await this.alertCtrl.create({
      header: 'Cerrar Sesión',
      message: '¿Estás seguro que deseas cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          handler: async () => {
            const loading = await this.loadingCtrl.create({
              message: 'Cerrando sesión...'
            });
            await loading.present();

            try {
              // Cerrar sesión en Firebase
              await this.auth.signOut();
              
              // Limpiar storage
              await this.storage.remove('auth_token');
              await this.storage.remove('current_user');
              
              await loading.dismiss();
              
              // Redirigir a login
              this.router.navigate(['/login'], { replaceUrl: true });
            } catch (error) {
              console.error('Error al cerrar sesión:', error);
              await loading.dismiss();
              this.showAlert('Error', 'No se pudo cerrar sesión. Intenta nuevamente.');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  getExperienceYears(): number {
    if (!this.driver?.years_experience) return 0;
    return this.driver.years_experience;
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

}