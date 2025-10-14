import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DriverSetupPageRoutingModule } from './driver-setup-routing.module';

import { DriverSetupPage } from './driver-setup.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DriverSetupPageRoutingModule
  ],
  declarations: [DriverSetupPage]
})
export class DriverSetupPageModule {}
