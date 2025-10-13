import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ActiveJobPage } from './active-job.page';

const routes: Routes = [
  {
    path: '',
    component: ActiveJobPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActiveJobPageRoutingModule {}