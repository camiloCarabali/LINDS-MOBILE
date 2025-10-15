import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EnviosDisponiblesPage } from './envios-disponibles.page';

const routes: Routes = [
  {
    path: '',
    component: EnviosDisponiblesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EnviosDisponiblesPageRoutingModule {}
