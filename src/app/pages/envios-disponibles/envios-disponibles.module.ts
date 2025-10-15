import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnviosDisponiblesPageRoutingModule } from './envios-disponibles-routing.module';

import { EnviosDisponiblesPage } from './envios-disponibles.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EnviosDisponiblesPageRoutingModule
  ],
  declarations: [EnviosDisponiblesPage]
})
export class EnviosDisponiblesPageModule {}
