import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DriverSetupPage } from './driver-setup.page';

const routes: Routes = [
  {
    path: '',
    component: DriverSetupPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DriverSetupPageRoutingModule {}
