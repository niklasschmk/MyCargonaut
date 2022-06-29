import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CreateEvaluationPageRoutingModule } from './create-evaluation-routing.module';
import { CreateEvaluationPage } from './create-evaluation.page';
import {IonicRatingComponentModule} from "ionic-rating-component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CreateEvaluationPageRoutingModule,
    IonicRatingComponentModule,
    ReactiveFormsModule
  ],
  declarations: [CreateEvaluationPage]
})
export class CreateEvaluationPageModule {}
