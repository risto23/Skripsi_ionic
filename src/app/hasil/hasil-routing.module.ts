import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HasilPage } from './hasil.page';

const routes: Routes = [
  {
    path: '',
    component: HasilPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HasilPageRoutingModule {}
