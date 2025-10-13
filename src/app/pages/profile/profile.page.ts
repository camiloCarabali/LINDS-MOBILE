import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  driver = {
    name: 'Juan Carlos Pérez',
    email: 'juan.perez@email.com',
    phone: '+57 300 123 4567',
    license: 'C2 - 123456789',
    rating: 4.8,
    totalJobs: 127,
    totalEarnings: 15600000,
    joinDate: new Date('2023-06-15'),
    vehicleType: 'Camión NHR',
    plateNumber: 'ABC-123'
  };

  paymentMethods = [
    { id: '1', type: 'Cuenta Bancaria', info: '**** 1234', default: true },
    { id: '2', type: 'Nequi', info: '**** 5678', default: false }
  ];

  constructor() { }

  ngOnInit() {
  }

  editProfile() {
    console.log('Editando perfil...');
  }

  addPaymentMethod() {
    console.log('Agregando método de pago...');
  }

  viewPaymentHistory() {
    console.log('Ver historial de pagos...');
  }

  logout() {
    console.log('Cerrando sesión...');
  }

  getExperienceYears(): number {
    return new Date().getFullYear() - this.driver.joinDate.getFullYear() + 1;
  }

}