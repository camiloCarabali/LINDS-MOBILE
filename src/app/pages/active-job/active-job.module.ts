import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActiveJobPage } from './active-job.page';

import { ActiveJobPageRoutingModule } from './active-job-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ActiveJobPageRoutingModule
  ],
  declarations: [ActiveJobPage]
})
export class ActiveJobPageModule {}