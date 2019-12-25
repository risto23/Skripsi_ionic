import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EncodePageRoutingModule } from './encode-routing.module';

import { EncodePage } from './encode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EncodePageRoutingModule
  ],
  declarations: [EncodePage]
})
export class EncodePageModule {}
