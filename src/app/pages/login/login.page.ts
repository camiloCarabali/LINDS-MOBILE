import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { StorageService } from '../../services/storage.service';
import { DriverService } from '../../services/driver.service';
import { environment } from '../../../environments/environment';
import { LoadingController, AlertController } from '@ionic/angular';

// Firebase Auth
import { Auth, GoogleAuthProvider, signInWithPopup, UserCredential } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: StorageService,
    private driverService: DriverService,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private auth: Auth
  ) { }

  ngOnInit() {
    // Firebase Auth está configurado en app.module.ts
  }

  async signInWithGoogle() {
    this.isLoading = true;
    this.errorMessage = '';
    
    const loading = await this.loadingCtrl.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    try {
      // 1. Autenticar con Google usando Firebase Auth
      const provider = new GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      
      const result: UserCredential = await signInWithPopup(this.auth, provider);
      const user = result.user;
      
      console.log('Firebase User:', user);

      // 2. Obtener ID Token de Firebase
      const idToken = await user.getIdToken();
      
      if (!idToken) {
        throw new Error('No se pudo obtener el token de autenticación');
      }

      console.log('ID Token obtenido:', idToken.substring(0, 20) + '...');

      // 3. Registrar/Login en el backend
      const response = await this.http.post<any>(
        `${environment.apiUrl}/users`,
        { 
          role: 'driver',
          id_token: idToken 
        },
        {
          headers: {
            'Authorization': `Bearer ${idToken}`
          }
        }
      ).toPromise();

      console.log('Backend response:', response);

      // 4. Guardar datos en storage
      await this.storage.set('auth_token', idToken);
      await this.storage.set('current_user', {
        id: user.uid,
        email: user.email,
        name: user.displayName || '',
        photo: user.photoURL || '',
        role: 'driver'
      });

      // 5. Verificar si el conductor tiene perfil completo
      this.driverService.checkProfile().subscribe({
        next: async (profile) => {
          await loading.dismiss();
          
          if (profile) {
            // Tiene perfil completo, ir a la página principal de tabs
            console.log('Driver has complete profile');
            await this.showSuccessAlert();
            // Navegar a tabs/jobs con navigateByUrl
            this.router.navigateByUrl('/tabs/jobs', { replaceUrl: true });
          } else {
            // No tiene perfil, ir al formulario de registro
            console.log('Driver needs to complete profile');
            await this.showWelcomeAlert();
            this.router.navigateByUrl('/driver-setup', { replaceUrl: true });
          }
        },
        error: async (error) => {
          console.error('Error checking profile:', error);
          await loading.dismiss();
          // En caso de error, ir al formulario de registro por seguridad
          await this.showWelcomeAlert();
          this.router.navigateByUrl('/driver-setup', { replaceUrl: true });
        }
      });

    } catch (error: any) {
      console.error('Error en login:', error);
      await loading.dismiss();
      
      this.errorMessage = error.message || 'Error al iniciar sesión con Google';
      
      await this.showErrorAlert(this.errorMessage);
    } finally {
      this.isLoading = false;
    }
  }

  private async showSuccessAlert() {
    const alert = await this.alertCtrl.create({
      header: '¡Bienvenido de nuevo!',
      message: 'Has iniciado sesión exitosamente',
      buttons: ['OK']
    });
    await alert.present();
  }

  private async showWelcomeAlert() {
    const alert = await this.alertCtrl.create({
      header: '¡Bienvenido a LINDS!',
      message: 'Para comenzar, necesitamos que completes tu perfil de conductor.',
      buttons: ['Continuar']
    });
    await alert.present();
  }

  private async showErrorAlert(message: string) {
    const alert = await this.alertCtrl.create({
      header: 'Error',
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
