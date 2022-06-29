import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateEvaluationPage } from './create-evaluation.page';

const routes: Routes = [
  {
    path: '',
    component: CreateEvaluationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateEvaluationPageRoutingModule {}
