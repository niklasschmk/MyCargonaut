import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ProfilePageRoutingModule } from './profile-routing.module';

import { ProfilePage } from './profile.page';
import {VehicleItemComponent} from '../Vehicles/vehicle-item/vehicle-item.component';
import {EvalCardComponent} from "../Evaluation/eval-card/eval-card.component";
import {IonicRatingComponentModule} from "ionic-rating-component";
import {Tab1PageModule} from '../tab1/tab1.module';
import {RideCardComponent} from '../ride-card/ride-card.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProfilePageRoutingModule,
    Tab1PageModule,
    IonicRatingComponentModule
  ],
  exports: [
    RideCardComponent
  ],
  declarations: [ProfilePage, VehicleItemComponent, RideCardComponent, EvalCardComponent]
})
export class ProfilePageModule {}
