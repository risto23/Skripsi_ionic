import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EncodePage } from './encode.page';

const routes: Routes = [
  {
    path: '',
    component: EncodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EncodePageRoutingModule {}
