import { Component, OnInit } from '@angular/core';
import {VehicleService} from '../../../services/vehicle.service';
import {NavController} from '@ionic/angular';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.page.html',
  styleUrls: ['./add-vehicle.page.scss'],
})
export class AddVehiclePage implements OnInit {
  name: string;
  cargoSpace: number;
  seats: number;

  constructor(private vehicleService: VehicleService, private navCtrl: NavController,
              private authService: AuthService) { }

  ngOnInit() {
  }

  /**
   * Add a vehicle with data from the input fields
   */
  addVehicle(){
    this.vehicleService.addVehicle(this.name, this.seats, this.cargoSpace).then(() => {
      this.navCtrl.pop();
    });
  }

}
