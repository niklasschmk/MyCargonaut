import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import {VehicleItemComponent} from '../Vehicles/vehicle-item/vehicle-item.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule
  ],
  declarations: [ProfilePage, VehicleItemComponent]
})
export class ProfilePageModule {}
