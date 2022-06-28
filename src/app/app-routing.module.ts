import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'profile',
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'otherUser',
    loadChildren: () => import('./profile/profile.module').then(m => m.ProfilePageModule)
  },
  {
    path: 'add-vehicle',
    loadChildren: () => import('./Vehicles/add-vehicle/add-vehicle.module').then(m => m.AddVehiclePageModule)
  },
  {
    path: 'create-offer',
    loadChildren: () => import('./create-offer/create-offer.module').then( m => m.CreateOfferPageModule)
  },
  {
    path: 'offer-detail',
    loadChildren: () => import('./offer-detail/offer-detail.module').then( m => m.OfferDetailPageModule)
  },
  {
    path: 'bookings',
    loadChildren: () => import('./bookings/bookings.module').then(m => m.BookingsPageModule)
  },  {
    path: 'ride-detail',
    loadChildren: () => import('./ride-detail/ride-detail.module').then( m => m.RideDetailPageModule)
  }




];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
