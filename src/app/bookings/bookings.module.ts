import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RidesPageRoutingModule } from './bookings-routing.module';

import { BookingsPage } from './bookings.page';
import {Tab1PageModule} from '../tab1/tab1.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RidesPageRoutingModule,
    Tab1PageModule
  ],
  declarations: [BookingsPage]
})
export class BookingsPageModule {}
