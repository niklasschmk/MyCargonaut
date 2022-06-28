import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';

import { Tab1PageRoutingModule } from './tab1-routing.module';
import {OfferCardComponent} from "../offer-card/offer-card.component";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    Tab1PageRoutingModule
  ],
  exports: [
    OfferCardComponent
  ],
  declarations: [Tab1Page, OfferCardComponent]
})
export class Tab1PageModule {}
