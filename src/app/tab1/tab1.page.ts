import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {NavController} from '@ionic/angular';
import {ToastService} from '../../services/toast.service';
import {UserService} from '../../services/user.service';
import {OfferService} from '../../services/offer.service';
import {VehicleService} from "../../services/vehicle.service";
import {Vehicle} from "../../model/vehicle";
import {Observable} from "rxjs";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements OnInit{
  vehicles: Vehicle[]
  vehicleObserve: Observable<Vehicle[]>

  constructor(public authService: AuthService, private router: Router, private nacCtrl: NavController,
              public offerService: OfferService, private toastService: ToastService, public userService: UserService,
              public vehicleService: VehicleService) {}

  async ngOnInit(){
  }

  /**
   * Navigating to login page if the user is not logged in or to the creating page
   */
  createOffer() {
    //get vehicles of logged in user
    this.vehicleService.getVehicles().then(res => {
      this.vehicleObserve = res;
      this.vehicleObserve.subscribe(vehicles => {
        this.vehicles = vehicles;
      });
      if(this.authService.user === null){
        this.router.navigate(['login']).then();
        this.toastService.presentToast('Um ein Angebot zu erstellen, musst du dich anmelden!', 'danger').then();
      }else if(this.vehicles.length === 0){
        this.router.navigate(['profile']).then();
        this.toastService.presentToast('Um ein Angebot zu erstellen, füge deinem Profil bitte ein' +
          ' Fahrzeug hinzu!', 'danger').then();
      }
      else{
        this.router.navigate(['create-offer']).then();
      }
    });
  }
}
