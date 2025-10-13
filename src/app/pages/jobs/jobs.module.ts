import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobsPage } from './jobs.page';

import { JobsPageRoutingModule } from './jobs-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    JobsPageRoutingModule
  ],
  declarations: [JobsPage]
})
export class JobsPageModule {}