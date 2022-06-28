import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreateEvalPage } from './create-eval.page';

const routes: Routes = [
  {
    path: '',
    component: CreateEvalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CreateEvalPageRoutingModule {}
