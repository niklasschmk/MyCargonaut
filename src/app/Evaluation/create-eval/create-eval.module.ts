import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateEvalPageRoutingModule } from './create-eval-routing.module';
import { CreateEvalPage } from './create-eval.page';
import {IonicRatingComponentModule} from 'ionic-rating-component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateEvalPageRoutingModule,
    IonicRatingComponentModule,
    ReactiveFormsModule
  ],
  declarations: [CreateEvalPage]
})
export class CreateEvalPageModule {}
