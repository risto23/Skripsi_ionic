import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HasilPageRoutingModule } from './hasil-routing.module';

import { HasilPage } from './hasil.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HasilPageRoutingModule
  ],
  declarations: [HasilPage]
})
export class HasilPageModule {}
